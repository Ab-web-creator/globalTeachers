import { readToken } from "../../../../lib/consultation/token";
import { emailConfig, sendEmail } from "../../../../lib/consultation/email";
import { summarize } from "../../../../lib/consultation/answers";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) return Response.json({ error: "Недопустимый запрос." }, { status: 403 });
  let application;
  try {
    const body = await request.text();
    if (body.length > 21000) throw new Error("Too large");
    application = readToken(JSON.parse(body).token);
  } catch {
    return Response.json({ error: "Ссылка недействительна или срок её действия истёк. Заполните заявку ещё раз." }, { status: 400 });
  }
  try {
    const { recipient } = emailConfig();
    await sendEmail({
      to: recipient,
      reply_to: application.answers.email,
      subject: "Подтверждённая заявка на консультацию — GlobalTeacherHub",
      text: `Email подтверждён.\n\n${summarize(application.answers)}`,
    }, `consultation-${application.id}`);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Не удалось завершить отправку заявки. Попробуйте ещё раз." }, { status: 503 });
  }
}
