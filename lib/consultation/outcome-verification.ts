import { database } from "./database";
import { createToken, hashToken } from "./token";
import { emailConfig, sendEmail } from "./email";

export async function sendOutcomeVerification(attemptId: string) {
  const { origin } = emailConfig();
  const token = createToken();
  const saved = await database().query(`INSERT INTO consultation_outcome_verifications (attempt_id, token_hash)
    VALUES ($1, $2) ON CONFLICT (attempt_id) DO UPDATE SET token_hash = EXCLUDED.token_hash,
      created_at = now(), expires_at = now() + interval '24 hours'
    WHERE consultation_outcome_verifications.confirmed_at IS NULL
      AND consultation_outcome_verifications.created_at <= now() - interval '1 minute'
    RETURNING attempt_id`, [attemptId, hashToken(token)]);
  if (!saved.rowCount) throw new Error("Verification cooldown");
  const record = await database().query("SELECT email FROM consultation_attempts WHERE id = $1", [attemptId]);
  const link = `${origin}/consultation/confirm#${token}`;
  await sendEmail({
    to: record.rows[0].email,
    subject: "Подтвердите email — TeacherNavigator",
    text: `Здравствуйте!\n\nЧтобы подтвердить ваш email и получить подробную информацию от TeacherNavigator, откройте ссылку:\n\n${link}\n\nСсылка действительна 24 часа. После подтверждения мы отправим вам ещё одно письмо с подробной информацией.\n\nЕсли вы не оставляли заявку, просто проигнорируйте это письмо.`,
  }, `outcome-verification-${hashToken(token)}`);
}

export async function confirmOutcomeEmail(tokenHash: string): Promise<string | null> {
  const result = await database().query(`UPDATE consultation_outcome_verifications
    SET confirmed_at = COALESCE(confirmed_at, now())
    WHERE token_hash = $1 AND (confirmed_at IS NOT NULL OR expires_at > clock_timestamp())
    RETURNING attempt_id`, [tokenHash]);
  return result.rows[0]?.attempt_id ?? null;
}
