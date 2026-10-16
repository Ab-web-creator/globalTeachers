import { database } from "../consultation/database";
import { emailConfig, sendEmail } from "../consultation/email";

export type MailFolder = "inbox" | "sent" | "candidates" | "frozen" | "start-clients" | "pro-clients" | "vip-clients" | "spam";

// Paid status routes all incoming correspondence; unpaid payment requests share the Candidates folder.
const senderEmail = `lower(btrim(regexp_replace(COALESCE(mailbox_messages.reply_to[1], mailbox_messages.from_address), '^.*<([^>]+)>.*$', '\\1')))`;
const paidSender = `SELECT 1 FROM private_clients client WHERE client.email = ${senderEmail} AND client.paid_at IS NOT NULL`;
const frozenSender = `SELECT 1 FROM private_clients client WHERE client.email = ${senderEmail} AND client.paid_at IS NULL AND client.frozen_at IS NOT NULL`;
const frozenMessage = `direction = 'inbound' AND NOT spam AND EXISTS (${frozenSender})`;
const paymentContactMessage = (tier: 'START' | 'PRO' | 'VIP') => `direction = 'inbound' AND NOT spam AND EXISTS (${paidSender} AND client.tier = '${tier}')`;
const candidateMessage = `direction = 'inbound' AND NOT spam AND NOT EXISTS (${paidSender}) AND NOT EXISTS (${frozenSender}) AND EXISTS (
  SELECT 1 FROM payment_contact_requests request
  WHERE mailbox_messages.id = request.id OR (
    mailbox_messages.subject = 'Другой способ оплаты ' || request.tier || ' — TeacherNavigator'
    AND request.email = ANY(mailbox_messages.reply_to)
  )
)`;

const paymentContactFolder = `CASE
  WHEN spam THEN 'spam'
  WHEN ${frozenMessage} THEN 'frozen'
  WHEN ${candidateMessage} THEN 'candidates'
  WHEN ${paymentContactMessage('START')} THEN 'start-clients'
  WHEN ${paymentContactMessage('PRO')} THEN 'pro-clients'
  WHEN ${paymentContactMessage('VIP')} THEN 'vip-clients'
  ELSE 'inbox' END`;

export function messageFolder(message: Pick<MailMessage, "direction" | "folder">): MailFolder {
  return message.direction === "outbound" ? "sent" : message.folder ?? "inbox";
}
export type MailAttachment = { id: string; filename: string; content_type: string; size?: number };
export type MailMessage = {
  id: string; folder?: MailFolder; direction: "inbound" | "outbound"; from_address: string; to_addresses: string[]; cc_addresses: string[];
  reply_to: string[]; subject: string; text_body: string | null; html_body: string | null; attachments: MailAttachment[];
  message_id: string | null; reply_to_message: string | null; created_at: Date; read_at: Date | null;
};
export type MailSummary = Pick<MailMessage, "id" | "from_address" | "to_addresses" | "subject" | "created_at" | "read_at"> & { snippet: string; has_attachments: boolean };

export const mailPageSize = 30;

export async function listMessages(folder: MailFolder, page: number) {
  const condition = folder === "sent" ? "direction = 'outbound' AND sent_at IS NOT NULL"
    : folder === "frozen" ? frozenMessage
    : folder === "candidates" ? candidateMessage
    : folder === "start-clients" ? paymentContactMessage("START")
    : folder === "pro-clients" ? paymentContactMessage("PRO")
    : folder === "vip-clients" ? paymentContactMessage("VIP")
    : folder === "spam" ? "direction = 'inbound' AND spam"
    : `direction = 'inbound' AND NOT (spam OR ${frozenMessage} OR ${candidateMessage} OR ${paymentContactMessage("START")} OR ${paymentContactMessage("PRO")} OR ${paymentContactMessage("VIP")})`;
  const counts = await database().query(
    `SELECT count(*) FILTER (WHERE ${condition})::int AS total,
       count(*) FILTER (WHERE direction = 'inbound' AND read_at IS NULL AND NOT spam)::int AS unread
     FROM mailbox_messages`,
  );
  const { total, unread } = counts.rows[0];
  const pages = Math.max(1, Math.ceil(total / mailPageSize));
  const current = Math.min(Math.max(1, Number.isInteger(page) ? page : 1), pages);
  const result = await database().query(
    `SELECT id, from_address, to_addresses, subject, created_at, read_at,
       left(regexp_replace(COALESCE(text_body, ''), '\\s+', ' ', 'g'), 160) AS snippet,
       jsonb_array_length(attachments) > 0 AS has_attachments
     FROM mailbox_messages WHERE ${condition}
     ORDER BY created_at DESC, id DESC LIMIT $1 OFFSET $2`,
    [mailPageSize, (current - 1) * mailPageSize],
  );
  return { messages: result.rows as MailSummary[], total, unread, page: current, pages };
}

export type FolderCounts = Partial<Record<MailFolder, { total: number; unread: number }>>;

export async function folderMessageCounts(): Promise<FolderCounts> {
  const result = await database().query(
    `SELECT CASE WHEN direction = 'outbound' THEN 'sent' ELSE ${paymentContactFolder} END AS folder,
       count(*)::int AS total,
       count(*) FILTER (WHERE direction = 'inbound' AND read_at IS NULL)::int AS unread
     FROM mailbox_messages WHERE direction = 'inbound' OR sent_at IS NOT NULL
     GROUP BY 1`,
  );
  return Object.fromEntries(result.rows.map((row) => [row.folder, { total: row.total, unread: row.unread }]));
}

export async function unreadCount() {
  const result = await database().query("SELECT count(*)::int AS unread FROM mailbox_messages WHERE direction = 'inbound' AND read_at IS NULL AND NOT spam");
  return result.rows[0].unread as number;
}

/** Read-only lookup for the Gmail copy links; unlike opening it in the admin, this keeps it unread. */
export async function getMessage(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const result = await database().query(`SELECT *, ${paymentContactFolder} AS folder FROM mailbox_messages WHERE id = $1 AND (direction = 'inbound' OR sent_at IS NOT NULL)`, [id]);
  return (result.rows[0] as MailMessage | undefined) ?? null;
}

/** Opening an inbound email marks it as read. */
export async function openMessage(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const result = await database().query(
    `UPDATE mailbox_messages SET read_at = COALESCE(read_at, now())
     WHERE id = $1 AND (direction = 'inbound' OR sent_at IS NOT NULL) RETURNING *, ${paymentContactFolder} AS folder`,
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

/** Permanently remove an email from the admin mailbox. Replies keep existing; their link to it is cleared. */
export async function deleteMessage(id: string) {
  const result = await database().query("DELETE FROM mailbox_messages WHERE id = $1", [id]);
  return result.rowCount === 1;
}

export async function markUnread(id: string) {
  const result = await database().query("UPDATE mailbox_messages SET read_at = NULL WHERE id = $1 AND direction = 'inbound'", [id]);
  return result.rowCount === 1;
}
