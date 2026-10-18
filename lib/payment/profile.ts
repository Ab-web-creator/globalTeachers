import { filterPaymentSubjects } from "./subjects";
import { database } from "../consultation/database";

export type PaymentProfile = {
  firstName: string;
  lastName: string;
  subject: string;
  education: string;
  english: string;
};

export async function paymentProfileExists(
  email: string,
  excludeDraftId?: string,
): Promise<boolean> {
  const result = excludeDraftId
    ? await database().query(
        "SELECT 1 FROM consultation_attempts WHERE lower(email) = $1 AND id <> $2 LIMIT 1",
        [email, excludeDraftId],
      )
    : await database().query(
        "SELECT 1 FROM consultation_attempts WHERE lower(email) = $1 LIMIT 1",
        [email],
      );
  return Boolean(result.rowCount);
}

export async function findPaymentProfile(
  email: string,
  excludeDraftId?: string,
): Promise<PaymentProfile | null> {
  const result = await database().query(
    `SELECT COALESCE(p.answers, c.answers, a.answers) AS answers
    FROM consultation_attempts a
    LEFT JOIN consultation_pending p ON p.id = a.id
    LEFT JOIN consultation_applications c ON c.id = a.id
    WHERE lower(a.email) = $1 ${excludeDraftId ? "AND a.id <> $2" : ""} ORDER BY a.submitted_at DESC, a.id DESC LIMIT 1`,
    excludeDraftId ? [email, excludeDraftId] : [email],
  );
  if (!result.rowCount) return null;
  const answers = result.rows[0].answers;
  const profile = Object.fromEntries(
    ["firstName", "lastName", "subject", "education", "english"].map((key) => [
      key,
      typeof answers[key] === "string" ? answers[key] : "",
    ]),
  ) as PaymentProfile;
  return { ...profile, subject: filterPaymentSubjects(profile.subject) };
}
