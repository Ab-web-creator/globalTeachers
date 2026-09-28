import type { NextRequest } from "next/server";
import { trustedRequestOrigin } from "../../../lib/request-origin";
import { sessionCookie, validSession } from "../../../lib/admin/session";
import { database } from "../../../lib/consultation/database";

export async function POST(request: NextRequest) {
  if (!trustedRequestOrigin(request)) return new Response("Forbidden", { status: 403 });
  if (process.env.NODE_ENV !== "development" && !validSession(request.cookies.get(sessionCookie)?.value)) {
    return new Response("Unauthorized", { status: 401 });
  }
  let input;
  try { input = await request.json(); } catch { return new Response("Invalid request", { status: 400 }); }
  if (!input || typeof input.id !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(input.id)
    || (input.status !== "pending" && input.status !== "confirmed")) {
    return new Response("Invalid application", { status: 400 });
  }
  try {
    const sql = input.status === "pending"
      ? "DELETE FROM consultation_pending WHERE id = $1"
      : "DELETE FROM consultation_applications WHERE id = $1";
    const result = await database().query(sql, [input.id]);
    if (!result.rowCount) return Response.json({ error: "Заявка уже удалена или её статус изменился. Обновите страницу." }, { status: 404 });
    return new Response(null, { status: 204 });
  } catch {
    return Response.json({ error: "Не удалось удалить заявку. Попробуйте ещё раз." }, { status: 503 });
  }
}
