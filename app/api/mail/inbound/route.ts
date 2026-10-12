import { receiveEmail } from "../../../../lib/mailbox/inbound";
import { validWebhook } from "../../../../lib/mailbox/signature";

// Resend posts `email.received` here; the body is only metadata, so the email is fetched from its API.
export async function POST(request: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) return new Response("Inbound email is not configured", { status: 503 });
  const body = await request.text();
  if (!validWebhook(body, request.headers, secret)) return new Response("Invalid signature", { status: 401 });
  let event;
  try { event = JSON.parse(body); } catch { return new Response("Invalid payload", { status: 400 }); }
  if (event?.type !== "email.received") return new Response(null, { status: 204 });
  const id = event.data?.email_id;
  if (typeof id !== "string" || !id || id.length > 100) return new Response("Invalid payload", { status: 400 });
  try {
    await receiveEmail(id);
    return new Response(null, { status: 204 });
  } catch {
    // A non-2xx response makes Resend retry the webhook later.
    console.error("Inbound email processing failed.");
    return new Response("Processing failed", { status: 500 });
  }
}
