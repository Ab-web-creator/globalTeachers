import type { NextRequest } from "next/server";
import {
  clientFromSession,
  clientSessionCookie,
} from "../../../../lib/client-area/access";
import { database } from "../../../../lib/consultation/database";
import { trustedRequestOrigin } from "../../../../lib/request-origin";
import { privateJson } from "../../../../lib/client-area/http";

export const runtime = "nodejs";
const maxBytes = 2 * 1024 * 1024;

export async function GET(request: NextRequest) {
  const id = await clientFromSession(
    request.cookies.get(clientSessionCookie)?.value,
  );
  if (!id) return privateJson({ error: "Нет доступа." }, 401);
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

export async function POST(request: NextRequest) {
  if (!trustedRequestOrigin(request))
    return privateJson({ error: "Forbidden" }, 403);
  const id = await clientFromSession(
    request.cookies.get(clientSessionCookie)?.value,
  );
  if (!id) return privateJson({ error: "Нет доступа." }, 401);
  const reader = request.body?.getReader();
  if (!reader) return privateJson({ error: "Выберите фото." }, 400);
  const parts: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      return privateJson({ error: "Размер фото — не более 2 МБ." }, 413);
    }
    parts.push(value);
  }
  const bytes = Buffer.concat(parts);
  const type = bytes
    .subarray(0, 8)
    .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    ? "image/png"
    : bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
      ? "image/jpeg"
      : bytes.toString("ascii", 0, 4) === "RIFF" &&
          bytes.toString("ascii", 8, 12) === "WEBP"
        ? "image/webp"
        : null;
  if (!type)
    return privateJson({ error: "Выберите фото JPG, PNG или WebP." }, 400);
  await database().query(
    "UPDATE private_clients SET profile_photo = $2, profile_photo_type = $3 WHERE id = $1",
    [id, bytes, type],
  );
  return privateJson({ ok: true });
}
