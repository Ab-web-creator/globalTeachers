import { database } from "../consultation/database";
import type { Answers } from "../../app/consultation/components/form-fields";

export type Application = {
  id: string; email: string; answers: Answers; status: "pending" | "confirmed";
  submitted_at: Date; confirmed_at: Date | null; expires_at: Date | null;
  notification_sent_at: Date | null; expired: boolean;
};
export type ApplicationFilter = "all" | "pending" | "confirmed";
export const pageSize = 20;
const records = `WITH records AS (
  SELECT id, email, answers, 'pending'::text AS status, created_at AS submitted_at,
    NULL::timestamptz AS confirmed_at, expires_at, NULL::timestamptz AS notification_sent_at
  FROM consultation_pending
  UNION ALL
  SELECT id, email, answers, 'confirmed'::text AS status, submitted_at,
    confirmed_at, NULL::timestamptz AS expires_at, notification_sent_at
  FROM consultation_applications
)`;
const where = `WHERE ($1 = 'all' OR status = $1)
  AND ($2 = '' OR strpos(lower(email), lower($2)) > 0 OR EXISTS (
    SELECT 1 FROM jsonb_each_text(answers) AS answer
    WHERE strpos(lower(answer.value), lower($2)) > 0
  ))`;

export async function listApplications(filter: ApplicationFilter, search: string, requestedPage: number) {
  const db = database();
  const counts = await db.query(`SELECT
    (SELECT count(*)::int FROM consultation_pending) AS pending,
    (SELECT count(*)::int FROM consultation_applications) AS confirmed`);
  const matched = await db.query(`${records} SELECT count(*)::int AS total FROM records ${where}`, [filter, search]);
  const total = matched.rows[0].total as number;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(pages, Math.max(1, Number.isFinite(requestedPage) ? Math.floor(requestedPage) : 1));
  const result = await db.query<Application>(`${records} SELECT *, COALESCE(expires_at <= now(), false) AS expired FROM records ${where}
    ORDER BY submitted_at DESC, id DESC LIMIT $3 OFFSET $4`, [filter, search, pageSize, (page - 1) * pageSize]);
  return { applications: result.rows, counts: counts.rows[0] as { pending: number; confirmed: number }, total, page, pages };
}
