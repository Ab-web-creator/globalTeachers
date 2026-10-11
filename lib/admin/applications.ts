import { database } from "../consultation/database";
import type { Answers } from "../../app/consultation/components/form-fields";

export type ApplicationAttempt = {
  id: string; answers: Answers; submitted_at: string; confirmed_at: string | null;
  status: "draft" | "pending" | "confirmed" | "superseded" | "expired"; last_step: string | null;
};
export type QualificationChange = { previous_answer: string; new_answer: string; changed_at: string };
export type Application = {
  qualification_changes: QualificationChange[];
  answer_changes: (QualificationChange & { field: "subject" | "education" | "english" })[];
  id: string; email: string; answers: Answers; status: "draft" | "pending" | "confirmed";
  latest_status: "pending" | "confirmed"; email_confirmed_at: Date | null;
  submitted_at: Date; confirmed_at: Date | null; expires_at: Date | null;
  latest_is_draft: boolean; notification_sent_at: Date | null; expired: boolean; editable: boolean; attempts: ApplicationAttempt[];
};
export type ApplicationFilter = "all" | "draft" | "pending" | "confirmed";
export const pageSize = 20;
const records = `WITH histories AS (
  SELECT lower(email) AS email,
    min(confirmed_at) AS email_confirmed_at,
    jsonb_agg(jsonb_build_object('id', id, 'answers', answers, 'submitted_at', submitted_at,
      'confirmed_at', confirmed_at, 'status', status, 'last_step', last_step) ORDER BY submitted_at, id) AS attempts
  FROM consultation_attempts GROUP BY lower(email)
), latest AS (
  SELECT DISTINCT ON (lower(email)) * FROM consultation_attempts
  ORDER BY lower(email), submitted_at DESC, id DESC
), records AS (
  SELECT latest.id, histories.email, COALESCE(p.answers, c.answers, latest.answers) AS answers,
    CASE WHEN histories.email_confirmed_at IS NOT NULL THEN 'confirmed' WHEN latest.status = 'draft' THEN 'draft' ELSE 'pending' END AS status,
    CASE WHEN latest.status = 'confirmed' THEN 'confirmed' ELSE 'pending' END AS latest_status,
    histories.email_confirmed_at, (latest.status = 'draft') AS latest_is_draft,
    latest.submitted_at, latest.confirmed_at, p.expires_at, c.notification_sent_at,
    (p.id IS NOT NULL OR c.id IS NOT NULL) AS editable,
    (latest.status = 'expired' OR COALESCE(p.expires_at <= now(), false)) AS expired,
    histories.attempts,
    COALESCE((SELECT jsonb_agg(jsonb_build_object('previous_answer', changes.previous_answer,
      'new_answer', changes.new_answer, 'changed_at', changes.changed_at) ORDER BY changes.changed_at, changes.id)
      FROM consultation_qualification_changes changes JOIN consultation_attempts a ON a.id = changes.attempt_id
      WHERE lower(a.email) = histories.email), '[]'::jsonb) AS qualification_changes,
    COALESCE((SELECT jsonb_agg(jsonb_build_object('field', changes.field,
      'previous_answer', changes.previous_answer, 'new_answer', changes.new_answer,
      'changed_at', changes.changed_at) ORDER BY changes.changed_at, changes.id)
      FROM consultation_answer_changes changes JOIN consultation_attempts a ON a.id = changes.attempt_id
      WHERE lower(a.email) = histories.email), '[]'::jsonb) AS answer_changes
  FROM latest JOIN histories ON histories.email = lower(latest.email)
  LEFT JOIN consultation_pending p ON p.id = latest.id
  LEFT JOIN consultation_applications c ON c.id = latest.id
)`;
const where = `WHERE ($1 = 'all' OR ($1 = 'draft' AND latest_is_draft) OR ($1 <> 'draft' AND status = $1))
  AND ($2 = '' OR strpos(lower(email), lower($2)) > 0 OR EXISTS (
    SELECT 1 FROM jsonb_array_elements(attempts) AS attempt,
      jsonb_each_text(attempt->'answers') AS answer
    WHERE strpos(lower(answer.value), lower($2)) > 0
  ) OR EXISTS (
    SELECT 1 FROM jsonb_each_text(answers) AS answer
    WHERE strpos(lower(answer.value), lower($2)) > 0
  ))`;

export async function listApplications(filter: ApplicationFilter, search: string, requestedPage: number) {
  const db = database();
  const counts = await db.query(`${records} SELECT
    count(*) FILTER (WHERE latest_is_draft)::int AS draft,
    count(*) FILTER (WHERE status = 'pending')::int AS pending,
    count(*) FILTER (WHERE status = 'confirmed')::int AS confirmed FROM records`);
  const matched = await db.query(`${records} SELECT count(*)::int AS total FROM records ${where}`, [filter, search]);
  const total = matched.rows[0].total as number;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(pages, Math.max(1, Number.isFinite(requestedPage) ? Math.floor(requestedPage) : 1));
  const result = await db.query<Application>(`${records} SELECT * FROM records ${where}
    ORDER BY submitted_at DESC, id DESC LIMIT $3 OFFSET $4`, [filter, search, pageSize, (page - 1) * pageSize]);
  return { applications: result.rows, counts: counts.rows[0] as { draft: number; pending: number; confirmed: number }, total, page, pages };
}

export async function getApplication(id: string): Promise<Application | null> {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return null;
  const result = await database().query<Application>(`${records} SELECT * FROM records
    WHERE email = (SELECT lower(email) FROM consultation_attempts WHERE id = $1)`, [id]);
  return result.rows[0] ?? null;
}
