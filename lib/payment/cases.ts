import { database } from "../consultation/database";
import { answerLabels } from "../consultation/answers";
import { draftIdentity, draftTokenHash } from "../consultation/drafts";
import { paymentSubjects } from "./subjects";

const education = [
  "Среднее специальное",
  "Бакалавр",
  "Магистр",
  "Докторская степень",
  "Профессор",
];
const english = [
  "Не говорю по-английски",
  "Базовый — могу общаться на простые темы",
  "Средний — могу поддерживать разговор",
  "Уверенный — могу работать на английском",
];

export async function savePaymentCase(input: unknown) {
  if (!input || typeof input !== "object")
    throw new Error("Проверьте данные заявки.");
  const data = input as Record<string, unknown>;
  const identity = draftIdentity(data.draft);
  if (
    !identity ||
    !Number.isSafeInteger(data.revision) ||
    Number(data.revision) < 1 ||
    !["START", "PRO", "VIP"].includes(String(data.tier))
  )
    throw new Error("Проверьте данные заявки.");
  const email =
    typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw new Error("Укажите корректный email.");
  const profile = data.profile as Record<string, unknown> | undefined;
  if (!profile || typeof profile !== "object")
    throw new Error("Проверьте данные заявки.");
  const answers: Record<string, string> = Object.fromEntries(
    Object.keys(answerLabels).map((key) => [key, ""]),
  );
  for (const key of ["name", "subject", "education", "english"]) {
    const value = profile[key] ?? "";
    if (
      typeof value !== "string" ||
      value.length > (key === "subject" ? 1000 : 200)
    )
      throw new Error("Проверьте данные заявки.");
    answers[key] = value.trim();
  }
  const selected = answers.subject ? answers.subject.split("; ") : [];
  if (
    selected.length > 3 ||
    new Set(selected).size !== selected.length ||
    !selected.every((subject) => paymentSubjects.includes(subject)) ||
    (answers.education && !education.includes(answers.education)) ||
    (answers.english && !english.includes(answers.english))
  )
    throw new Error("Выберите значения из списка.");
  answers.email = email;
  answers.packagePreference =
    data.tier === "START" ? "Start" : data.tier === "PRO" ? "Pro" : "VIP";
  if (!answers.name) throw new Error("Укажите ваше имя.");
  const complete = true;
  const connection = await database().connect();
  try {
    await connection.query("BEGIN");
    await connection.query(
      "SELECT pg_advisory_xact_lock(hashtextextended($1, 0))",
      [`payment-case:${email}`],
    );
    const result = await connection.query(
      `INSERT INTO consultation_attempts
      (id, email, answers, submitted_at, status, draft_token_hash, draft_revision, last_step)
      SELECT $1, $2, $3, now(), $4, $5, $6, $7
      WHERE EXISTS (SELECT 1 FROM consultation_attempts WHERE id = $1)
        OR (SELECT count(*) FROM consultation_attempts WHERE lower(email) = $2 AND last_step LIKE 'payment:%' AND submitted_at > now() - interval '1 day') < 10
      ON CONFLICT (id) DO UPDATE SET answers = EXCLUDED.answers, status = EXCLUDED.status,
        draft_revision = EXCLUDED.draft_revision, last_step = EXCLUDED.last_step, updated_at = now()
      WHERE consultation_attempts.draft_token_hash = EXCLUDED.draft_token_hash
        AND consultation_attempts.email = EXCLUDED.email AND consultation_attempts.last_step LIKE 'payment:%'
        AND consultation_attempts.status IN ('draft', 'payment') AND consultation_attempts.draft_revision < EXCLUDED.draft_revision
      RETURNING id, status`,
      [
        identity.id,
        email,
        JSON.stringify(answers),
        "payment",
        draftTokenHash(identity.token),
        data.revision,
        `payment:${data.tier}`,
      ],
    );
    if (!result.rowCount)
      throw new Error(
        "Не удалось сохранить заявку. Обновите страницу и попробуйте снова.",
      );
    await connection.query("COMMIT");
    return { saved: true, complete };
  } catch (error) {
    await connection.query("ROLLBACK");
    throw error;
  } finally {
    connection.release();
  }
}
