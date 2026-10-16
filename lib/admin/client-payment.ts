import { ensurePaidClientAccess } from "../client-area/access";
import { database } from "../consultation/database";
import { createToken, hashToken } from "../consultation/token";
import { clientTiers, type ClientTier } from "../client-area/types";

export async function markApplicationPaid(id: string, tier: ClientTier) {
  if (!clientTiers.includes(tier)) throw new Error("Выберите пакет.");
  const result = await database().query(
    `INSERT INTO private_clients(email, name, tier, key_hash, paid_at)
    SELECT lower(email), btrim(answers->>'name'), $2, $3, now()
    FROM consultation_attempts WHERE id = $1 AND btrim(COALESCE(answers->>'name', '')) <> ''
    ON CONFLICT (email) DO UPDATE SET tier = EXCLUDED.tier, frozen_at = NULL, paid_at = COALESCE(private_clients.paid_at, EXCLUDED.paid_at)
    RETURNING id, tier`,
    [id, tier, hashToken(createToken())],
  );
  if (!result.rowCount) throw new Error("Сначала укажите имя клиента в заявке.");
  await ensurePaidClientAccess(result.rows[0].id);
  return result.rows[0];
}

export async function messagePaymentDetails(messageId: string) {
  const { addressOf, getMessage } = await import("../mailbox/messages");
  const message = await getMessage(messageId);
  if (!message || message.direction !== "inbound") throw new Error("Входящее письмо не найдено.");
  const email = addressOf(message.reply_to[0] ?? message.from_address).toLowerCase();
  if (!/^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]+$/.test(email)) throw new Error("Адрес клиента некорректен.");
  const result = await database().query(
    `SELECT (SELECT paid_at FROM private_clients WHERE email=$1) AS paid_at,
      (SELECT tier FROM private_clients WHERE email=$1) AS client_tier,
      (SELECT id FROM consultation_attempts WHERE lower(email)=$1 AND btrim(COALESCE(answers->>'name','')) <> '' ORDER BY submitted_at DESC,id DESC LIMIT 1) AS application_id,
      (SELECT name FROM payment_contact_requests WHERE lower(email)=$1 ORDER BY (id=$2) DESC,created_at DESC LIMIT 1) AS name,
      (SELECT tier FROM payment_contact_requests WHERE lower(email)=$1 ORDER BY (id=$2) DESC,created_at DESC LIMIT 1) AS contact_tier`,
    [email, messageId],
  );
  const row = result.rows[0];
  return { ...row, email, tier: row.client_tier ?? row.contact_tier ?? null };
}

export async function markMessagePaid(messageId: string, tier: ClientTier | null) {
  if (tier !== null && !clientTiers.includes(tier)) throw new Error("Выберите пакет.");
  const details = await messagePaymentDetails(messageId);
  if (tier === null) {
    await database().query("UPDATE private_clients SET paid_at=NULL, frozen_at=COALESCE(frozen_at, now()) WHERE email=$1 AND paid_at IS NOT NULL", [details.email]);
    return { paid: false };
  }
  if (details.application_id) return markApplicationPaid(details.application_id, tier);
  if (!details.name?.trim()) throw new Error("Сначала клиент должен указать имя и email в форме.");
  const result = await database().query(
    `INSERT INTO private_clients(email,name,tier,key_hash,paid_at) VALUES($1,$2,$3,$4,now())
    ON CONFLICT(email) DO UPDATE SET tier=EXCLUDED.tier, frozen_at=NULL, paid_at=COALESCE(private_clients.paid_at,EXCLUDED.paid_at)
    RETURNING id,tier`,
    [details.email, details.name.trim(), tier, hashToken(createToken())],
  );
  await ensurePaidClientAccess(result.rows[0].id);
  return result.rows[0];
}

export async function setClientPayment(clientId: string, tier: ClientTier | null) {
  if (tier !== null && !clientTiers.includes(tier)) throw new Error("Выберите пакет.");
  const result = tier === null
    ? await database().query(
        `UPDATE private_clients SET frozen_at=CASE WHEN paid_at IS NOT NULL THEN COALESCE(frozen_at,now()) ELSE frozen_at END,
        paid_at=NULL WHERE id=$1 RETURNING id,tier`, [clientId],
      )
    : await database().query(
        "UPDATE private_clients SET tier=$2,paid_at=COALESCE(paid_at,now()),frozen_at=NULL WHERE id=$1 RETURNING id,tier", [clientId,tier],
      );
  if (!result.rowCount) throw new Error("Клиент не найден.");
  if (tier !== null) await ensurePaidClientAccess(result.rows[0].id);
  return result.rows[0];
}
