import { createHash } from "node:crypto";
import { parseAnswers } from "../../../lib/consultation/answers";
import { emailConfig, sendEmail } from "../../../lib/consultation/email";
import { createToken } from "../../../lib/consultation/token";

export const runtime = "nodejs";
const attempts = new Map<string, number>();

export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) return Response.json({ error: "Недопустимый запрос." }, { status: 403 });
  let answers;
  try {
    const body = await request.text();
    if (body.length > 20000) throw new Error("Too large");
    answers = parseAnswers(JSON.parse(body));
  } catch {
    return Response.json({ error: "Проверьте заполнение всех полей заявки." }, { status: 400 });
  }
  const identity = createHash("sha256").update(answers.email.toLowerCase()).digest("hex");
  const now = Date.now();
  for (const [id, expires] of attempts) if (expires <= now) attempts.delete(id);
  if (attempts.has(identity)) return Response.json({ error: "Подождите минуту перед повторной отправкой." }, { status: 429 });
  attempts.set(identity, now + 60000);
  try {
    const { origin } = emailConfig();
    // The fragment keeps the encrypted application out of HTTP access logs and referrers.
    const link = `${origin}/consultation/confirm#${createToken(answers)}`;
    await sendEmail({
      to: answers.email,
      subject: "Подтвердите email — GlobalTeacherHub",
      text: `Спасибо за обращение в GlobalTeacherHub!\n\nЧтобы подтвердить ваш email и отправить заявку на консультацию, откройте ссылку:\n\n${link}\n\nСсылка действительна 24 часа. После подтверждения мы получим вашу заявку и свяжемся с вами, чтобы обсудить следующие шаги.\n\nЕсли вы не оставляли заявку, просто проигнорируйте это письмо.`,
    });
    return Response.json({ ok: true });
  } catch {
    attempts.delete(identity);
    return Response.json({ error: "Не удалось отправить письмо. Попробуйте позже." }, { status: 503 });
  }
}
