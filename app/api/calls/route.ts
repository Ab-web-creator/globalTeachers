import { randomBytes, randomUUID } from "node:crypto";
import { NextRequest } from "next/server";
import { validSession, sessionCookie } from "../../../lib/admin/session";
import { trustedRequestOrigin } from "../../../lib/request-origin";
import { database } from "../../../lib/consultation/database";
import { findCall, iceServers, tokenHash } from "../../../lib/calls/server";
import { getApplication } from "../../../lib/admin/applications";
const admin = (r: NextRequest) =>
  process.env.NODE_ENV === "development" ||
  validSession(r.cookies.get(sessionCookie)?.value);
export async function GET(r: NextRequest) {
  if (r.nextUrl.searchParams.get("incoming") === "1") {
    if (!admin(r)) return new Response(null, { status: 401 });
    const rows = await database().query(
      "SELECT id,name,email FROM browser_calls WHERE state='ringing' AND expires_at>now() AND client_seen>now()-interval '20 seconds' ORDER BY updated_at DESC LIMIT 5",
    );
    return Response.json(rows.rows, {
      headers: { "Cache-Control": "no-store" },
    });
  }
  const token = r.headers.get("x-call-token") ?? undefined;
  if (!token && !admin(r)) return new Response(null, { status: 401 });
  const call = await findCall(r.nextUrl.searchParams.get("id") ?? "", token);
  if (!call) return new Response(null, { status: 404 });
  const role = token ? "client" : "admin";
  const stale = await database().query(
    "UPDATE browser_calls SET state='ended',updated_at=now() WHERE id=$1 AND state IN ('ringing','accepted') AND ((state='ringing' AND updated_at<now()-interval '60 seconds') OR (updated_at<now()-interval '45 seconds' AND (client_seen IS NULL OR client_seen<now()-interval '45 seconds' OR (state='accepted' AND (admin_seen IS NULL OR admin_seen<now()-interval '45 seconds'))))) RETURNING id",
    [call.id],
  );
  if (stale.rowCount) {
    call.state = "ended";
    call.updated_at = new Date();
  }
  await database().query(
    `UPDATE browser_calls SET ${role}_seen=now() WHERE id=$1`,
    [call.id],
  );
  const after = Number(r.nextUrl.searchParams.get("after") ?? 0);
  if (!Number.isSafeInteger(after) || after < 0)
    return new Response(null, { status: 400 });
  const signals = await database().query(
    "SELECT id,payload FROM browser_call_signals WHERE call_id=$1 AND sender<>$2 AND id>$3 ORDER BY id LIMIT 100",
    [call.id, role, after],
  );
  return Response.json(
    {
      state: call.state,
      retryAfter: Math.max(0, Math.ceil((new Date(call.updated_at).getTime() + 20000 - Date.now()) / 1000)),
      signals: signals.rows,
      iceServers: iceServers(),
      relayConfigured: !!(process.env.CALL_TURN_URL && process.env.CALL_TURN_SECRET),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
export async function POST(r: NextRequest) {
  if (!trustedRequestOrigin(r)) return new Response(null, { status: 403 });
  const raw = await r.text();
  if (raw.length > 20000) return new Response(null, { status: 413 });
  let input;
  try {
    input = JSON.parse(raw);
  } catch {
    return new Response(null, { status: 400 });
  }
  if (!input || typeof input !== "object" || Array.isArray(input))
    return new Response(null, { status: 400 });
  if (input.action === "invite") {
    if (!admin(r)) return new Response(null, { status: 401 });
    const application = await getApplication(input.applicationId);
    if (!application) return new Response(null, { status: 404 });
    const hours = Number(input.hours);
    if (![1, 24, 72, 168].includes(hours))
      return new Response(null, { status: 400 });
    const token = randomBytes(32).toString("hex"),
      id = randomUUID();
    await database().query(
      "INSERT INTO browser_calls(id,token_hash,email,name,expires_at) VALUES($1,$2,$3,$4,now()+$5*interval '1 hour')",
      [
        id,
        tokenHash(token),
        application.email,
        application.answers.name,
        hours,
      ],
    );
    return Response.json({
      id,
      url: `${trustedRequestOrigin(r)}/call/${token}`,
      email: application.email,
    });
  }
  const token = r.headers.get("x-call-token") ?? undefined;
  if (!token && !admin(r)) return new Response(null, { status: 401 });
  const call = await findCall(input.id, token);
  if (!call) return new Response(null, { status: 404 });
  const role = token ? "client" : "admin";
  if (input.action === "ring") {
    if (role !== "client") return new Response(null, { status: 403 });
    const client = await database().connect();
    try {
      await client.query("BEGIN");
      const result = await client.query("UPDATE browser_calls SET state='ringing',updated_at=now(),client_seen=now(),admin_seen=NULL WHERE id=$1 AND expires_at>now() AND (state='waiting' OR (state IN ('ended','declined') AND updated_at<=now()-interval '20 seconds')) RETURNING id", [call.id]);
      if (!result.rowCount) {
        await client.query("ROLLBACK");
        return new Response(null, { status: 409 });
      }
      await client.query("DELETE FROM browser_call_signals WHERE call_id=$1", [call.id]);
      await client.query("COMMIT");
      return new Response(null, { status: 204 });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally { client.release(); }
  }
  if (input.action === "signal") {
    if (
      call.state !== "accepted" ||
      !input.payload ||
      !["offer", "answer", "candidate"].includes(input.payload.type)
    )
      return new Response(null, { status: 409 });
    const count = await database().query(
      "SELECT count(*)::int AS n FROM browser_call_signals WHERE call_id=$1",
      [call.id],
    );
    if (count.rows[0].n >= 500) return new Response(null, { status: 429 });
    await database().query(
      "INSERT INTO browser_call_signals(call_id,sender,payload) VALUES($1,$2,$3)",
      [call.id, role, input.payload],
    );
  } else {
    const transitions: Record<
      string,
      {
        from: string[];
        to: string;
        role?: string;
      }
    > = {
      ring: { from: ["waiting"], to: "ringing", role: "client" },
      accept: { from: ["ringing"], to: "accepted", role: "admin" },
      decline: { from: ["ringing"], to: "declined", role: "admin" },
      end: { from: ["waiting", "ringing", "accepted"], to: "ended" },
      revoke: { from: ["waiting", "ringing", "accepted", "ended", "declined"], to: "revoked", role: "admin" },
    };
    const t = transitions[input.action];
    if (!t || (t.role && t.role !== role))
      return new Response(null, { status: 403 });
    const result = await database().query(
      "UPDATE browser_calls SET state=$2,updated_at=now() WHERE id=$1 AND state=ANY($3::text[]) RETURNING id",
      [call.id, t.to, t.from],
    );
    if (!result.rowCount) return new Response(null, { status: 409 });
  }
  return new Response(null, { status: 204 });
}
