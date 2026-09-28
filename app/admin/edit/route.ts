import type { NextRequest } from "next/server";
import { trustedRequestOrigin } from "../../../lib/request-origin";
import { sessionCookie, validSession } from "../../../lib/admin/session";
import { database } from "../../../lib/consultation/database";
import { parseAnswers } from "../../../lib/consultation/answers";

export async function POST(request: NextRequest) {
  if (!trustedRequestOrigin(request)) return new Response("Forbidden", { status: 403 });
  if (process.env.NODE_ENV !== "development" && !validSession(request.cookies.get(sessionCookie)?.value)) {
    return new Response("Unauthorized", { status: 401 });
  }
  let input, answers;
  try {
    input = await request.json();
    if (!input || typeof input.id !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(input.id)
      || (input.status !== "pending" && input.status !== "confirmed") || !input.originalAnswers || typeof input.originalAnswers !== "object") throw new Error("Invalid request");
    answers = parseAnswers(input.answers);
  } catch {
    return Response.json({ error: "Проверьте обязательные поля, email и выбранные предметы." }, { status: 400 });
  }
  try {
    const table = input.status === "pending" ? "consultation_pending" : "consultation_applications";
    const result = await database().query(`UPDATE ${table} SET email = $1, answers = $2::jsonb WHERE id = $3 AND answers = $4::jsonb`, [answers.email, JSON.stringify(answers), input.id, JSON.stringify(input.originalAnswers)]);
    if (!result.rowCount) return Response.json({ error: "Заявка удалена или изменена. Обновите страницу перед редактированием." }, { status: 409 });
    return new Response(null, { status: 204 });
  } catch (cause) {
    const conflict = (cause as { code?: string })?.code === "23505";
    return Response.json({ error: conflict ? "Временная заявка с таким email уже существует." : "Не удалось сохранить изменения. Попробуйте ещё раз." }, { status: conflict ? 409 : 503 });
  }
}
