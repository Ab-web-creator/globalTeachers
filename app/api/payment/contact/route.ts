import { trustedRequestOrigin } from "../../../../lib/request-origin";
import { database } from "../../../../lib/consultation/database";
import { emailConfig, sendEmail } from "../../../../lib/consultation/email";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const reply = (body: object, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
  if (!trustedRequestOrigin(request)) return reply({ error: "Недопустимый запрос." }, 403);
  let id: string, name: string, email: string, tier: string, message: string;
  try {
    const body = await request.text();
    if (body.length > 12000) throw new Error();
    const input = JSON.parse(body);
    if (!["id", "name", "email", "tier", "message"].every((key) => typeof input?.[key] === "string")) throw new Error();
    id = input.id; name = input.name.trim(); email = input.email.trim().toLowerCase(); tier = input.tier; message = input.message.trim();
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)
      || !name || name.length > 200 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      || !["START", "PRO", "VIP"].includes(tier) || !message || message.length > 2000) throw new Error();
  } catch { return reply({ error: "Проверьте имя, email и сообщение." }, 400); }
  try {
    const { recipient } = emailConfig();
    const result = await database().query(`INSERT INTO payment_contact_requests (id, name, email, tier, message)
      SELECT $1, $2, $3, $4, $5 WHERE NOT EXISTS (
        SELECT 1 FROM payment_contact_requests WHERE email = $3 AND created_at > now() - interval '1 minute' AND id <> $1
      ) ON CONFLICT (id) DO UPDATE SET id = EXCLUDED.id
      WHERE payment_contact_requests.email = EXCLUDED.email AND payment_contact_requests.name = EXCLUDED.name
        AND payment_contact_requests.tier = EXCLUDED.tier AND payment_contact_requests.message = EXCLUDED.message
      RETURNING notified_at`, [id, name, email, tier, message]);
    if (!result.rowCount) return reply({ error: "Подождите минуту перед повторной отправкой." }, 429);
    if (!result.rows[0].notified_at) {
      await sendEmail({ to: recipient, reply_to: email, subject: `Другой способ оплаты ${tier} — TeacherNavigator`,
        text: `Программа: ${tier}\nИмя: ${name}\nEmail: ${email}\n\n${message}` }, `payment-contact-${id}`);
      await database().query("UPDATE payment_contact_requests SET notified_at = now() WHERE id = $1", [id]);
    }
    return reply({ ok: true });
  } catch { return reply({ error: "Не удалось отправить сообщение. Попробуйте ещё раз." }, 503); }
}
