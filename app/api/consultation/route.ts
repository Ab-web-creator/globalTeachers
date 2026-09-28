import { trustedRequestOrigin } from "../../../lib/request-origin";
import { AnswerValidationError, parseAnswers } from "../../../lib/consultation/answers";
import { emailConfig, sendEmail } from "../../../lib/consultation/email";
import { removeExpiredApplications, savePendingApplication } from "../../../lib/consultation/applications";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!trustedRequestOrigin(request)) return Response.json({ error: "Недопустимый запрос." }, { status: 403 });
  let answers;
  try {
    const body = await request.text();
    if (body.length > 20000) throw new Error("Too large");
    answers = parseAnswers(JSON.parse(body));
  } catch (error) {
    if (error instanceof AnswerValidationError) return Response.json({ error: error.message, field: error.field }, { status: 400 });
    return Response.json({ error: "Проверьте заполнение всех полей заявки." }, { status: 400 });
  }
  try {
    const { origin } = emailConfig();
    await removeExpiredApplications();
    const token = await savePendingApplication(answers);
    if (!token) return Response.json({ error: "Подождите минуту перед повторной отправкой." }, { status: 429 });
    // Only a random token goes into the link; personal data stays in the database.
    const link = `${origin}/consultation/confirm#${token}`;
    await sendEmail({
      to: answers.email,
      subject: "Подтвердите email — GlobalTeacherHub",
      text: `Спасибо за обращение в GlobalTeacherHub!\n\nЧтобы подтвердить ваш email и отправить заявку на консультацию, откройте ссылку:\n\n${link}\n\nСсылка действительна 24 часа. После подтверждения мы получим вашу заявку и свяжемся с вами, чтобы обсудить следующие шаги.\n\nЕсли вы не оставляли заявку, просто проигнорируйте это письмо.`,
    });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Не удалось отправить письмо. Попробуйте позже." }, { status: 503 });
  }
}
