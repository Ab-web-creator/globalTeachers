import { invitationEmailHtml, personalInvitationBody } from "./invitation-email";
import { database } from "../consultation/database";
import { emailConfig, sendEmail } from "../consultation/email";
import { createToken, hashToken } from "../consultation/token";
import { addressOf, getMessage } from "../mailbox/messages";
import { clientTiers, type ClientTier, type Invitation } from "./types";
import { fullName } from "../person-name";

export async function getInvitation(id: string): Promise<Invitation | null> {
  const result = await database().query(
    `SELECT invite.id, invite.client_id, client.name, client.email,
    invite.subject, invite.body, invite.status, invite.due_at, invite.first_attempt_at
    FROM client_invitations invite JOIN private_clients client ON client.id = invite.client_id WHERE invite.id = $1`,
    [id],
  );
  return result.rows[0] ?? null;
}

export async function prepareInvitation(
  messageId: string,
  requestedTier?: ClientTier,
) {
  const message = await getMessage(messageId);
  if (!message || message.direction !== "inbound")
    throw new Error("Входящее письмо не найдено.");
  const email = addressOf(
    message.reply_to[0] ?? message.from_address,
  ).toLowerCase();
  if (!/^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]+$/.test(email))
    throw new Error("Адрес получателя некорректен.");
  const request = await database().query(
    `SELECT first_name, last_name, tier FROM payment_contact_requests
    WHERE id = $1 OR email = $2 ORDER BY (id = $1) DESC, created_at DESC LIMIT 1`,
    [messageId, email],
  );
  const application = await database().query(
    `SELECT answers FROM consultation_applications WHERE lower(email) = $1 ORDER BY confirmed_at DESC LIMIT 1`,
    [email],
  );
  const saved = request.rows[0];
  const preference =
    application.rows[0]?.answers?.packagePreference?.toUpperCase();
  const tier = requestedTier ?? saved?.tier ?? preference;
  if (!clientTiers.includes(tier))
    throw new Error("Выберите пакет клиента перед отправкой ключа.");
  const answers = application.rows[0]?.answers;
  const person = saved
    ? { firstName: saved.first_name, lastName: saved.last_name }
    : answers?.firstName
      ? { firstName: answers.firstName, lastName: answers.lastName ?? "" }
      : { firstName: email.split("@")[0], lastName: "" };
  const name = fullName(person);
  const { origin } = emailConfig();
  const key = createToken();
  const connection = await database().connect();
  let inviteId: string;
  try {
    await connection.query("BEGIN");
    await connection.query(
      "SELECT pg_advisory_xact_lock(hashtextextended($1, 38))",
      [email],
    );
    const existing = await connection.query(
      `SELECT invite.id FROM private_clients client
      JOIN client_invitations invite ON invite.client_id = client.id WHERE client.email = $1`,
      [email],
    );
    if (existing.rowCount) {
      inviteId = existing.rows[0].id;
    } else {
      const client = await connection.query(
        `INSERT INTO private_clients(email, first_name, last_name, tier, key_hash)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (email) DO UPDATE SET key_hash = EXCLUDED.key_hash
        RETURNING id`,
        [email, person.firstName.trim(), person.lastName.trim(), tier, hashToken(key)],
      );
      const body = personalInvitationBody(name, `${origin}/client#${key}`);
      const inserted = await connection.query(
        `INSERT INTO client_invitations(client_id, subject, body, html_body)
        VALUES ($1, 'Ваш ключ от личной страницы — TeacherNavigator', $2, $3) RETURNING id`,
        [
          client.rows[0].id,
          body,
          invitationEmailHtml(body, hashToken(key), origin),
        ],
      );
      inviteId = inserted.rows[0].id;
    }
    await connection.query("COMMIT");
  } catch (error) {
    await connection.query("ROLLBACK");
    throw error;
  } finally {
    connection.release();
  }
  return getInvitation(inviteId);
}

// Pausing is a server-side action: the background worker observes the same state.
export async function pauseInvitation(id: string) {
  const result = await database().query(
    `UPDATE client_invitations SET status = 'draft'
    WHERE id = $1 AND status IN ('scheduled', 'draft') AND first_attempt_at IS NULL RETURNING id`,
    [id],
  );
  if (!result.rowCount)
    throw new Error("Письмо уже отправляется или было отправлено.");
  return getInvitation(id);
}

export async function updateInvitation(
  id: string,
  subject: string,
  body: string,
) {
  const original = await getInvitation(id);
  if (!original) throw new Error("Приглашение не найдено.");
  // Keep the access link intact when an administrator edits the surrounding copy.
  const link = original.body.match(
    /https?:\/\/[^\s]+\/client#[A-Za-z0-9_-]{43}/,
  )?.[0];
  if (!link || !body.includes(link))
    throw new Error("Сохраните персональную ссылку в тексте письма.");
  const client = (
    await database().query(
      "SELECT key_hash FROM private_clients WHERE id = $1",
      [original.client_id],
    )
  ).rows[0];
  const html = invitationEmailHtml(body, client.key_hash, emailConfig().origin);
  const result = await database().query(
    `UPDATE client_invitations SET subject = $2, body = $3, html_body = $4, status = 'scheduled', due_at = now()
    WHERE id = $1 AND status = 'draft' AND first_attempt_at IS NULL RETURNING id`,
    [id, subject, body, html],
  );
  if (!result.rowCount)
    throw new Error("Это письмо больше нельзя редактировать.");
}

export async function deliverInvitation(
  id?: string,
): Promise<"sent" | "waiting" | "failed"> {
  const claimed = await database().query(
    `UPDATE client_invitations SET status = 'sending',
    lease_until = now() + interval '1 minute', first_attempt_at = COALESCE(first_attempt_at, now())
    WHERE id = (SELECT id FROM client_invitations
      WHERE ($1::uuid IS NULL OR id = $1) AND due_at <= now()
        AND (status = 'scheduled' OR (status = 'sending' AND lease_until < now()))
        AND (first_attempt_at IS NULL OR first_attempt_at > now() - interval '23 hours')
      ORDER BY due_at FOR UPDATE SKIP LOCKED LIMIT 1)
    RETURNING id, client_id, subject, body, html_body`,
    [id ?? null],
  );
  if (!claimed.rowCount) return "waiting";
  const job = claimed.rows[0];
  try {
    const { from } = emailConfig();
    const client = (
      await database().query(
        "SELECT email FROM private_clients WHERE id = $1",
        [job.client_id],
      )
    ).rows[0];
    const resendId = await sendEmail(
      {
        to: client.email,
        subject: job.subject,
        text: job.body,
        ...(job.html_body ? { html: job.html_body } : {}),
      },
      `client-invitation-${job.id}`,
    );
    const connection = await database().connect();
    try {
      await connection.query("BEGIN");
      await connection.query(
        "UPDATE private_clients SET active = true WHERE id = $1",
        [job.client_id],
      );
      await connection.query(
        `INSERT INTO mailbox_messages(id, direction, from_address, to_addresses, subject, text_body, html_body, resend_id, sent_at)
        VALUES ($1, 'outbound', $2, ARRAY[$3], $4, $5, $6, $7, now()) ON CONFLICT (id) DO NOTHING`,
        [
          job.id,
          from,
          client.email,
          job.subject,
          job.body,
          job.html_body,
          resendId ?? null,
        ],
      );
      await connection.query(
        "UPDATE client_invitations SET status = 'sent', sent_at = now(), lease_until = NULL WHERE id = $1",
        [job.id],
      );
      await connection.query("COMMIT");
    } catch (error) {
      await connection.query("ROLLBACK");
      throw error;
    } finally {
      connection.release();
    }
    return "sent";
  } catch {
    await database().query(
      "UPDATE client_invitations SET status = 'scheduled', lease_until = NULL, due_at = now() + interval '1 minute' WHERE id = $1",
      [job.id],
    );
    return "failed";
  }
}
