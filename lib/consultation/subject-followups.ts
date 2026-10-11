import { database } from "./database";
import { emailConfig, sendEmail } from "./email";
import { getSubjectEmailKind } from "../../app/consultation/components/subject-notices";
import { subjectEmailContent } from "./subject-email-content";

export async function deliverSubjectFollowup() {
  const result = await database().query(`UPDATE consultation_subject_followups SET
      lease_until = now() + interval '1 minute', first_attempt_at = COALESCE(first_attempt_at, now())
    WHERE email = (
      SELECT email FROM consultation_subject_followups
      WHERE sent_at IS NULL AND cancelled_at IS NULL AND due_at <= now() AND next_attempt_at <= now()
        AND (lease_until IS NULL OR lease_until < now())
        AND (first_attempt_at IS NULL OR first_attempt_at > now() - interval '23 hours')
      ORDER BY due_at LIMIT 1 FOR UPDATE SKIP LOCKED
    ) RETURNING id, email, source_id, message_text, message_html`);
  if (!result.rowCount) return false;
  const job = result.rows[0];
  try {
    const active = await database().query(`SELECT a.answers FROM consultation_subject_followups f
      JOIN consultation_attempts a ON a.id = f.source_id
      WHERE f.email = $1 AND f.cancelled_at IS NULL`, [job.email]);
    if (!active.rowCount) return true;
    const selected = (active.rows[0].answers.subject || "").split("; ").filter(Boolean);
    const kind = getSubjectEmailKind(selected);
    if (!kind) {
      await database().query("UPDATE consultation_subject_followups SET cancelled_at = now(), lease_until = NULL WHERE email = $1", [job.email]);
      return true;
    }
    const { origin } = emailConfig();
    const content = job.message_text ? { text: job.message_text, html: job.message_html } : subjectEmailContent(kind, origin);
    if (!job.message_text) await database().query("UPDATE consultation_subject_followups SET message_text = $2, message_html = $3 WHERE email = $1", [job.email, content.text, content.html]);
    await sendEmail({ to: job.email, subject: "Ваши направления преподавания — TeacherNavigator", ...content }, `subject-followup-${job.id}`);
    await database().query("UPDATE consultation_subject_followups SET sent_at = now(), lease_until = NULL WHERE email = $1", [job.email]);
  } catch {
    await database().query("UPDATE consultation_subject_followups SET lease_until = NULL, next_attempt_at = now() + interval '5 minutes' WHERE email = $1", [job.email]);
  }
  return true;
}
