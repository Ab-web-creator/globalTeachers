import { createHash } from "node:crypto";
import type { Answers } from "../../app/consultation/components/form-fields";
import { answerLabels } from "./answers";
import { consultationSteps } from "../../app/consultation/components/consultation-steps";
import { database } from "./database";

export type DraftIdentity = { id: string; token: string };
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function draftIdentity(input: unknown): DraftIdentity | null {
  if (!input || typeof input !== "object") return null;
  const data = input as Record<string, unknown>;
  return typeof data.id === "string" && uuid.test(data.id) && typeof data.token === "string" && uuid.test(data.token)
    ? { id: data.id, token: data.token } : null;
}

export function draftTokenHash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function saveDraft(input: unknown) {
  if (!input || typeof input !== "object") throw new Error("Invalid draft");
  const data = input as Record<string, unknown>;
  const identity = draftIdentity(data.draft);
  if (!identity || !Number.isSafeInteger(data.revision) || Number(data.revision) < 1
    || typeof data.step !== "string" || !consultationSteps.some((step) => step.fields[0] === data.step)
    || !data.answers || typeof data.answers !== "object") throw new Error("Invalid draft");
  const incoming = data.answers as Record<string, unknown>;
  const answers = {} as Answers;
  for (const key of Object.keys(answerLabels) as (keyof Answers)[]) {
    const value = incoming[key] ?? "";
    const limit = key === "subject" ? 6000 : key === "goals" ? 1500 : 300;
    if (typeof value !== "string" || value.length > limit) throw new Error("Invalid draft");
    answers[key] = value.trim();
  }
  if (!answers.email) throw new Error("Empty draft");
  return database().query(`INSERT INTO consultation_attempts
    (id, email, answers, submitted_at, status, draft_token_hash, draft_revision, last_step)
    VALUES ($1, $2, $3, now(), 'draft', $4, $5, $6)
    ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, answers = EXCLUDED.answers,
      draft_revision = EXCLUDED.draft_revision, last_step = EXCLUDED.last_step, updated_at = now()
    WHERE consultation_attempts.status = 'draft'
      AND consultation_attempts.draft_token_hash = EXCLUDED.draft_token_hash
      AND consultation_attempts.draft_revision < EXCLUDED.draft_revision
    RETURNING id`, [identity.id, answers.email.toLowerCase(), JSON.stringify(answers), draftTokenHash(identity.token), data.revision, data.step]);
}
