import { database } from "./database";
import { emailConfig, sendEmail } from "./email";
import { summarize } from "./answers";

export async function deliverNotification(id?: string) {
  // Persist a lease so concurrent confirmations/workers cannot send the same job.
  // Stop automatic retries before Resend's 24-hour idempotency window ends.
  const result = await database().query(
    `UPDATE consultation_applications SET
       notification_lease_until = now() + interval '1 minute',
       notification_first_attempt_at = COALESCE(notification_first_attempt_at, now()),
       notification_attempts = notification_attempts + 1
     WHERE id = (
       SELECT id FROM consultation_applications
       WHERE notification_sent_at IS NULL AND notification_next_attempt_at <= now()
         AND (notification_lease_until IS NULL OR notification_lease_until < now())
         AND (notification_first_attempt_at IS NULL OR notification_first_attempt_at > now() - interval '23 hours')
         AND ($1::uuid IS NULL OR id = $1)
       ORDER BY confirmed_at LIMIT 1 FOR UPDATE SKIP LOCKED
     ) RETURNING id, answers`,
    [id ?? null],
  );
  if (!result.rowCount) return false;
  const application = result.rows[0];
  try {
    const { recipient } = emailConfig();
    await sendEmail({
      to: recipient,
      reply_to: application.answers.email,
      subject: "Подтверждённая заявка на консультацию — GlobalTeacherHub",
      text: `Email подтверждён.\n\n${summarize(application.answers)}`,
    }, `consultation-${application.id}`);
    await database().query(
      "UPDATE consultation_applications SET notification_sent_at = now(), notification_lease_until = NULL WHERE id = $1",
      [application.id],
    );
  } catch {
    await database().query(
      `UPDATE consultation_applications SET notification_lease_until = NULL,
       notification_next_attempt_at = now() + interval '5 minutes' WHERE id = $1`,
      [application.id],
    );
  }
  return true;
}
