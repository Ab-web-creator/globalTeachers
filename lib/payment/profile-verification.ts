import { createHash, randomInt, timingSafeEqual } from "node:crypto";
import { database } from "../consultation/database";
import { createToken } from "../consultation/token";
import { sendEmail } from "../consultation/email";

const digest = (challenge: string, code: string) => createHash("sha256").update(`${challenge}:${code}`).digest();

export async function requestProfileCode(email: string) {
  const challenge = createToken();
  const code = String(randomInt(100000, 1000000));
  const saved = await database().query(`INSERT INTO payment_profile_verifications (email, challenge, code_hash)
    VALUES ($1, $2, $3) ON CONFLICT (email) DO UPDATE SET
      challenge = EXCLUDED.challenge, code_hash = EXCLUDED.code_hash, attempts = 0,
      created_at = now(), expires_at = now() + interval '10 minutes', consumed_at = NULL,
      window_start = CASE WHEN payment_profile_verifications.window_start <= now() - interval '1 hour' THEN now() ELSE payment_profile_verifications.window_start END,
      requests = CASE WHEN payment_profile_verifications.window_start <= now() - interval '1 hour' THEN 1 ELSE payment_profile_verifications.requests + 1 END
    WHERE payment_profile_verifications.created_at <= now() - interval '1 minute'
      AND (payment_profile_verifications.requests < 5 OR payment_profile_verifications.window_start <= now() - interval '1 hour')
    RETURNING challenge`, [email, challenge, digest(challenge, code).toString("hex")]);
  if (!saved.rowCount) return null;
  // Do not check whether a profile exists until the address has been verified.
  await sendEmail({
    to: email,
    subject: "Код подтверждения — TeacherNavigator",
    text: `Здравствуйте!\n\nВаш код подтверждения: ${code}\n\nВведите его на странице оплаты, чтобы загрузить данные вашей анкеты. Код действителен 10 минут.\n\nЕсли вы не запрашивали код, просто проигнорируйте это письмо.\n\nКоманда TeacherNavigator`,
  }, `payment-profile-${challenge}`);
  return challenge;
}

export async function verifyProfileCode(challenge: string, code: string): Promise<string | null> {
  const db = database();
  const checked = await db.query(`UPDATE payment_profile_verifications SET attempts = attempts + 1
    WHERE challenge = $1 AND consumed_at IS NULL AND expires_at > now() AND attempts < 5
    RETURNING code_hash`, [challenge]);
  if (!checked.rowCount) return null;
  const expected = Buffer.from(checked.rows[0].code_hash, "hex");
  const actual = digest(challenge, code);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
  // Only one concurrent request may consume a valid code.
  const consumed = await db.query(`UPDATE payment_profile_verifications SET consumed_at = now()
    WHERE challenge = $1 AND consumed_at IS NULL AND expires_at > now() AND attempts <= 5
    RETURNING email`, [challenge]);
  return consumed.rows[0]?.email ?? null;
}
