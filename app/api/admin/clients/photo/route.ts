import type { NextRequest } from "next/server";
import { adminAllowed, privateJson } from "../../../../../lib/client-area/http";
import { uuidPattern } from "../../../../../lib/client-area/types";
import { database } from "../../../../../lib/consultation/database";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!adminAllowed(request)) return privateJson({ error: "Unauthorized" }, 401);
  const id = request.nextUrl.searchParams.get("client") ?? "";
  if (!uuidPattern.test(id)) return privateJson({ error: "Invalid client" }, 400);
  const result = await database().query(
    "SELECT profile_photo, profile_photo_type FROM private_clients WHERE id = $1",
    [id],
  );
  const client = result.rows[0];
  if (!client?.profile_photo) return new Response(null, { status: 404 });
  return new Response(new Uint8Array(client.profile_photo), {
    headers: {
      "Content-Type": client.profile_photo_type,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
    },
  });
}
