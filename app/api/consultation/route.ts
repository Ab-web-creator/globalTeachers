import { trustedRequestOrigin } from "../../../lib/request-origin";
import { AnswerValidationError, parseAnswers } from "../../../lib/consultation/answers";
import { removeExpiredApplications, savePendingApplication } from "../../../lib/consultation/applications";

import { hashToken } from "../../../lib/consultation/token";
import { emailConfig, sendEmail } from "../../../lib/consultation/email";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!trustedRequestOrigin(request)) return Response.json({ error: "Недопустимый запрос." }, { status: 403 });
  let answers, draft;
  try {
    const body = await request.text();
    if (body.length > 20000) throw new Error("Too large");
    const input = JSON.parse(body);
    answers = parseAnswers(input);
    draft = input.draft;
  } catch (error) {
    if (error instanceof AnswerValidationError) return Response.json({ error: error.message, field: error.field }, { status: 400 });
    return Response.json({ error: "Проверьте заполнение всех полей заявки." }, { status: 400 });
  }
  try {
    const { origin } = emailConfig();
    await removeExpiredApplications();
    const token = await savePendingApplication(answers, draft);
    if (!token) return Response.json({ error: "Подождите минуту перед повторной отправкой." }, { status: 429 });
    const link = `${origin}/consultation/confirm#${token}`;
    await sendEmail({
      to: answers.email,
      subject: "Подтвердите email — TeacherNavigator",
      text: `Здравствуйте!\n\nЧтобы подтвердить ваш email и отправить заявку на консультацию TeacherNavigator, откройте ссылку:\n\n${link}\n\nСсылка действительна 24 часа. После подтверждения мы получим вашу заявку и свяжемся с вами.\n\nЕсли вы не оставляли заявку, просто проигнорируйте это письмо.`,
    }, `consultation-verification-${hashToken(token)}`);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Не удалось отправить письмо для подтверждения. Попробуйте позже." }, { status: 503 });
  }
}
