import type { NextRequest } from "next/server";
import { sessionCookie, validSession } from "../admin/session";

export function adminAllowed(request: NextRequest) {
  return (
    process.env.NODE_ENV === "development" ||
    validSession(request.cookies.get(sessionCookie)?.value)
  );
}
export function privateJson(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" },
  });
}
export async function smallJson(request: Request) {
  const body = await request.text();
  if (body.length > 60000) throw new Error("Слишком большой запрос.");
  return JSON.parse(body);
}
export function actionError(error: unknown) {
  return error instanceof Error && !("code" in error)
    ? error.message
    : "Не удалось выполнить действие. Попробуйте ещё раз.";
}
