import type { NextRequest } from "next/server";
import { sessionCookie, validSession } from "../../../../lib/admin/session";
import { database } from "../../../../lib/consultation/database";
import { receivedAttachments } from "../../../../lib/mailbox/resend";

// Resend's download links expire, so look up a fresh one each time an attachment is opened.
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV !== "development" && !validSession(request.cookies.get(sessionCookie)?.value)) {
    return new Response("Unauthorized", { status: 401 });
  }
  const message = request.nextUrl.searchParams.get("message") ?? "";
  const attachment = request.nextUrl.searchParams.get("attachment") ?? "";
  if (!/^[0-9a-f-]{36}$/i.test(message) || !attachment || attachment.length > 100) return new Response("Invalid request", { status: 400 });
  try {
    const row = (await database().query("SELECT resend_id FROM mailbox_messages WHERE id = $1 AND direction = 'inbound'", [message])).rows[0];
    if (!row?.resend_id) return new Response("Not found", { status: 404 });
    const file = (await receivedAttachments(row.resend_id)).find((item) => item.id === attachment);
    if (!file?.download_url) return new Response("Not found", { status: 404 });
    return new Response(null, { status: 303, headers: { Location: file.download_url, "Cache-Control": "no-store" } });
  } catch {
    return new Response("Attachment is unavailable", { status: 502 });
  }
}
