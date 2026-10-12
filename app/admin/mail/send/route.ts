import type { NextRequest } from "next/server";
import { trustedRequestOrigin } from "../../../../lib/request-origin";
import { sessionCookie, validSession } from "../../../../lib/admin/session";
import { sendMessage } from "../../../../lib/mailbox/messages";

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const emailPattern = /^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]+$/;

function addresses(value: unknown) {
  if (typeof value !== "string" || value.length > 2000) return null;
  const list = value.split(/[,;]/).map((email) => email.trim()).filter(Boolean);
  return list.length <= 20 && list.every((email) => emailPattern.test(email)) ? list : null;
}

export async function POST(request: NextRequest) {
  if (!trustedRequestOrigin(request)) return new Response("Forbidden", { status: 403 });
  if (process.env.NODE_ENV !== "development" && !validSession(request.cookies.get(sessionCookie)?.value)) {
    return new Response("Unauthorized", { status: 401 });
  }
  let input;
  try { input = await request.json(); } catch { return new Response("Invalid request", { status: 400 }); }
  const to = addresses(input?.to);
  const cc = addresses(input?.cc ?? "");
  const subject = typeof input?.subject === "string" ? input.subject.trim() : "";
  const text = typeof input?.text === "string" ? input.text : "";
  const replyTo = input?.replyTo ?? null;
  if (typeof input?.id !== "string" || !uuid.test(input.id) || (replyTo !== null && (typeof replyTo !== "string" || !uuid.test(replyTo)))) {
    return new Response("Invalid request", { status: 400 });
  }
  if (!to?.length) return Response.json({ error: "Укажите корректный адрес получателя." }, { status: 400 });
  if (!cc) return Response.json({ error: "Проверьте адреса в поле «Копия»." }, { status: 400 });
  if (!subject || subject.length > 300) return Response.json({ error: "Укажите тему письма (до 300 символов)." }, { status: 400 });
  if (!text.trim() || text.length > 50000) return Response.json({ error: "Напишите текст письма (до 50 000 символов)." }, { status: 400 });
  try {
    const result = await sendMessage({ id: input.id, to, cc, subject, text, replyTo });
    if (result === "sent" || result === "duplicate") return new Response(null, { status: 204 });
    if (result === "missing-original") return Response.json({ error: "Исходное письмо было удалено. Отправьте письмо без ответа." }, { status: 404 });
    if (result === "in-progress") return Response.json({ error: "Письмо уже отправляется. Обновите страницу." }, { status: 409 });
  } catch { /* fall through to the delivery error below */ }
  return Response.json({ error: "Не удалось отправить письмо. Попробуйте ещё раз." }, { status: 502 });
}
