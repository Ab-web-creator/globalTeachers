import { createHmac, randomUUID } from "node:crypto";
import { database } from "./database";
import { emailConfig, sendEmail } from "./email";
import { hashToken } from "./token";
import { fullName } from "../person-name";

export function confirmationReminderContent(name: string, link: string) {
  return `Здравствуйте${name ? ` ${name}` : ""},

Вы заполнили анкету на сайте TeacherNavigator, но ваш адрес электронной почты пока не подтверждён. Чтобы завершить подачу заявки, пожалуйста, перейдите по ссылке подтверждения, которую мы отправили вам ранее.

${link}

Повторно заполнять анкету не нужно — ваши ответы сохранены.

После подтверждения мы сможем рассмотреть вашу заявку и связаться с вами по поводу дальнейших шагов.

Если вы не получили письмо, проверьте папку «Спам».

С уважением,
Команда TeacherNavigator
teachernavigator.com`;
}

export async function deliverConfirmationReminder() {
  const secret = process.env.CRON_SECRET;
  if (!secret) throw new Error("CRON_SECRET is required for confirmation reminders");
  const client = await database().connect();
  try {
    await client.query("BEGIN");
    // Keep the row locked through delivery so confirmation and resubmission cannot
    // race with a reminder. Concurrent maintenance workers skip this row.
    const due = await client.query(`SELECT id, email, answers, token_hash FROM consultation_pending
      WHERE reminder_sent_at IS NULL AND created_at <= now() - interval '7 hours'
        AND expires_at > clock_timestamp()
      ORDER BY created_at LIMIT 1 FOR UPDATE SKIP LOCKED`);
    if (!due.rowCount) {
      await client.query("COMMIT");
      return false;
    }
    const application = due.rows[0];
    // Derive a stable additional confirmation token without storing a bearer token.
    // Retries use the same link and provider idempotency key; the original link stays valid.
    const token = createHmac("sha256", secret)
      .update(`confirmation-reminder:${application.token_hash}`).digest("base64url");
    const { origin, from } = emailConfig();
    const answers = application.answers;
    const name = answers.firstName && answers.lastName
      ? fullName(answers) : (answers.name ?? "").trim();
    await client.query("UPDATE consultation_pending SET reminder_token_hash = $2 WHERE id = $1",
      [application.id, hashToken(token)]);
    const message = {
      to: application.email,
      subject: "Подтвердите email, чтобы завершить подачу заявки — TeacherNavigator",
      text: confirmationReminderContent(name, `${origin}/consultation/confirm#${token}`),
    };
    const resendId = await sendEmail(message, `confirmation-reminder-${application.token_hash}`);
    // Save only this automated email type. The copy and sent marker commit together.
    await client.query(`INSERT INTO mailbox_messages
      (id, direction, resend_id, from_address, to_addresses, subject, text_body, sent_at)
      VALUES ($1, 'outbound', $2, $3, $4, $5, $6, now())`,
      [randomUUID(), resendId ?? null, from, [message.to], message.subject, message.text]);
    await client.query("UPDATE consultation_pending SET reminder_sent_at = now() WHERE id = $1", [application.id]);
    await client.query("COMMIT");
    return true;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
