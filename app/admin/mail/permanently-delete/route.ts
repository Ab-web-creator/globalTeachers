import type { NextRequest } from "next/server";
import { trustedRequestOrigin } from "../../../../lib/request-origin";
import { sessionCookie, validSession } from "../../../../lib/admin/session";
import { permanentlyDeleteMessage } from "../../../../lib/mailbox/messages";

export async function POST(request: NextRequest) {
  if (!trustedRequestOrigin(request)) return new Response("Forbidden", { status: 403 });
  if (process.env.NODE_ENV !== "development" && !validSession(request.cookies.get(sessionCookie)?.value)) {
    return new Response("Unauthorized", { status: 401 });
  }
  let input;
  try { input = await request.json(); } catch { return new Response("Invalid request", { status: 400 }); }
  if (typeof input?.id !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(input.id)) {
    return new Response("Invalid request", { status: 400 });
  }
  try {
    if (!(await permanentlyDeleteMessage(input.id))) return Response.json({ error: "Письмо не найдено в корзине. Обновите страницу." }, { status: 404 });
    return new Response(null, { status: 204 });
  } catch {
    return Response.json({ error: "Не удалось удалить письмо. Попробуйте ещё раз." }, { status: 503 });
  }
}
