import { database } from "../consultation/database";
import { emailConfig, sendEmail } from "../consultation/email";

export type MailFolder = "inbox" | "sent";
export type MailAttachment = { id: string; filename: string; content_type: string; size?: number };
export type MailMessage = {
  id: string; direction: "inbound" | "outbound"; from_address: string; to_addresses: string[]; cc_addresses: string[];
  reply_to: string[]; subject: string; text_body: string | null; html_body: string | null; attachments: MailAttachment[];
  message_id: string | null; reply_to_message: string | null; created_at: Date; read_at: Date | null;
};
export type MailSummary = Pick<MailMessage, "id" | "from_address" | "to_addresses" | "subject" | "created_at" | "read_at"> & { snippet: string; has_attachments: boolean };

export const mailPageSize = 30;

export async function listMessages(folder: MailFolder, page: number) {
  const direction = folder === "inbox" ? "inbound" : "outbound";
  const counts = await database().query(
    `SELECT count(*) FILTER (WHERE direction = $1 AND ($1 = 'inbound' OR sent_at IS NOT NULL))::int AS total,
       count(*) FILTER (WHERE direction = 'inbound' AND read_at IS NULL)::int AS unread
     FROM mailbox_messages`,
    [direction],
  );
  const { total, unread } = counts.rows[0];
  const pages = Math.max(1, Math.ceil(total / mailPageSize));
  const current = Math.min(Math.max(1, Number.isInteger(page) ? page : 1), pages);
  const result = await database().query(
    `SELECT id, from_address, to_addresses, subject, created_at, read_at,
       left(regexp_replace(COALESCE(text_body, ''), '\\s+', ' ', 'g'), 160) AS snippet,
       jsonb_array_length(attachments) > 0 AS has_attachments
     FROM mailbox_messages WHERE direction = $1 AND ($1 = 'inbound' OR sent_at IS NOT NULL)
     ORDER BY created_at DESC, id DESC LIMIT $2 OFFSET $3`,
    [direction, mailPageSize, (current - 1) * mailPageSize],
  );
  return { messages: result.rows as MailSummary[], total, unread, page: current, pages };
}

export async function unreadCount() {
  const result = await database().query("SELECT count(*)::int AS unread FROM mailbox_messages WHERE direction = 'inbound' AND read_at IS NULL");
  return result.rows[0].unread as number;
}

/** Opening an inbound email marks it as read. */
export async function openMessage(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const result = await database().query(
    `UPDATE mailbox_messages SET read_at = COALESCE(read_at, now())
     WHERE id = $1 AND (direction = 'inbound' OR sent_at IS NOT NULL) RETURNING *`,
    [id],
  );
  return (result.rows[0] as MailMessage | undefined) ?? null;
}

export function addressOf(value: string) {
  return (value.match(/<([^<>]+)>\s*$/)?.[1] ?? value).trim();
}

export type OutgoingMail = { id: string; to: string[]; cc: string[]; subject: string; text: string; replyTo: string | null };
export type SendResult = "sent" | "duplicate" | "in-progress" | "missing-original" | "failed";

/**
 * Record the email before sending so a repeated submission with the same id
 * cannot send twice; the id also serves as the Resend idempotency key.
 */
export async function sendMessage(mail: OutgoingMail): Promise<SendResult> {
  const { from } = emailConfig();
  let original: { message_id: string | null } | undefined;
  if (mail.replyTo) {
    original = (await database().query("SELECT message_id FROM mailbox_messages WHERE id = $1", [mail.replyTo])).rows[0];
    if (!original) return "missing-original";
  }
  const inserted = await database().query(
    `INSERT INTO mailbox_messages (id, direction, from_address, to_addresses, cc_addresses, subject, text_body, reply_to_message)
     VALUES ($1, 'outbound', $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING`,
    [mail.id, from, mail.to, mail.cc, mail.subject, mail.text, mail.replyTo],
  );
  if (!inserted.rowCount) {
    const existing = (await database().query("SELECT direction, sent_at FROM mailbox_messages WHERE id = $1", [mail.id])).rows[0];
    return existing?.direction === "outbound" && existing.sent_at ? "duplicate" : "in-progress";
  }
  try {
    const resendId = await sendEmail({
      to: mail.to,
      cc: mail.cc.length ? mail.cc : undefined,
      subject: mail.subject,
      text: mail.text,
      headers: original?.message_id ? { "In-Reply-To": original.message_id, References: original.message_id } : undefined,
    }, `mailbox-send-${mail.id}`);
    await database().query("UPDATE mailbox_messages SET resend_id = $2, sent_at = now() WHERE id = $1", [mail.id, resendId ?? null]);
    return "sent";
  } catch {
    await database().query("DELETE FROM mailbox_messages WHERE id = $1 AND sent_at IS NULL", [mail.id]);
    return "failed";
  }
}
