import { randomUUID } from "node:crypto";
import type { Answers } from "../../app/consultation/components/form-fields";
import { database } from "./database";
import { createToken, hashToken } from "./token";
import { draftIdentity, draftTokenHash } from "./drafts";
import { withFullName } from "./answers";

export async function removeExpiredApplications() {
  const result = await database().query("DELETE FROM consultation_pending WHERE expires_at <= now()");
  return result.rowCount ?? 0;
}

export async function savePendingApplication(answers: Answers, draftInput?: unknown) {
  const token = createToken();
  const identity = draftIdentity(draftInput);
  const client = await database().connect();
  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1, 0))", [answers.email.toLowerCase()]);
    let id = randomUUID();
    if (identity) {
      const draft = await client.query("SELECT id FROM consultation_attempts WHERE id = $1 AND draft_token_hash = $2 AND status = 'draft' FOR UPDATE", [identity.id, draftTokenHash(identity.token)]);
      if (draft.rowCount) id = draft.rows[0].id;
    }
    const result = await client.query(
      `INSERT INTO consultation_pending (id, email, answers, token_hash)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO UPDATE SET
         id = EXCLUDED.id, answers = EXCLUDED.answers, token_hash = EXCLUDED.token_hash,
         created_at = now(), expires_at = now() + interval '24 hours'
       WHERE consultation_pending.created_at <= now() - interval '60 seconds'
       RETURNING id`,
      [id, answers.email.toLowerCase(), JSON.stringify(withFullName(answers)), hashToken(token)],
    );
    await client.query("COMMIT");
    return result.rowCount ? token : null;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally { client.release(); }
}

export async function confirmApplication(tokenHash: string): Promise<string | null> {
  const client = await database().connect();
  try {
    await client.query("BEGIN");
    const pending = await client.query(
      "SELECT * FROM consultation_pending WHERE token_hash = $1 AND expires_at > clock_timestamp() FOR UPDATE",
      [tokenHash],
    );
    if (pending.rowCount) {
      const application = pending.rows[0];
      const saved = await client.query(
        `INSERT INTO consultation_applications (id, email, answers, token_hash, submitted_at)
         SELECT id, email, answers, token_hash, created_at FROM consultation_pending
         WHERE id = $1 AND expires_at > clock_timestamp() RETURNING id`,
        [application.id],
      );
      await client.query("DELETE FROM consultation_pending WHERE id = $1", [application.id]);
      await client.query("COMMIT");
      return saved.rows[0]?.id ?? null;
    }
    // A repeated or concurrent confirmation returns the existing permanent record.
    const confirmed = await client.query("SELECT id FROM consultation_applications WHERE token_hash = $1", [tokenHash]);
    await client.query("COMMIT");
    return confirmed.rows[0]?.id ?? null;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
