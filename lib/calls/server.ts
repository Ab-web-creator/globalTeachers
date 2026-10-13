import { createHash, createHmac } from "node:crypto";
import { database } from "../consultation/database";
export const tokenHash = (token: string) =>
  createHash("sha256").update(token).digest("hex");
export async function findCall(id: string, token?: string) {
  if (!/^[a-f0-9-]{36}$/i.test(id)) return null;
  const result = await database().query(
    "SELECT * FROM browser_calls WHERE id=$1 AND expires_at>now() AND ($2::text IS NULL OR token_hash=$2)",
    [id, token === undefined ? null : tokenHash(token)],
  );
  return result.rows[0] ?? null;
}
export function iceServers(): RTCIceServer[] {
  const servers: RTCIceServer[] = [
    { urls: process.env.CALL_STUN_URL || "stun:stun.l.google.com:19302" },
  ];
  if (process.env.CALL_TURN_URL && process.env.CALL_TURN_SECRET) {
    const username = `${Math.floor(Date.now() / 1000) + 3600}:consultation`;
    servers.push({
      urls: process.env.CALL_TURN_URL.split(","),
      username,
      credential: createHmac("sha1", process.env.CALL_TURN_SECRET)
        .update(username)
        .digest("base64"),
    });
  }
  return servers;
}
