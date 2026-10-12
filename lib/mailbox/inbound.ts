import { randomUUID } from "node:crypto";
import { database } from "../consultation/database";
import { emailConfig, sendEmail } from "../consultation/email";
import { receivedAttachments, receivedEmail } from "./resend";

const escape = (value: string) => value.replace(/[&<>"']/g, (character) => `&#${character.charCodeAt(0)};`);
const list = (value: unknown) => (Array.isArray(value) ? value : value ? [value] : []).map(String);

/** Copies go to MAILBOX_FORWARD_TO, never back to the mailbox itself (that would loop). */
function forwardRecipients(mailbox: string) {
  return (process.env.MAILBOX_FORWARD_TO ?? "").split(",").map((email) => email.trim()).filter((email) => email && email.toLowerCase() !== mailbox.toLowerCase());
}

/**
 * Store an email received through Resend and forward a copy. Safe to repeat:
 * Resend retries failed webhooks, so a stored email only retries its forward.
 */
export async function receiveEmail(resendId: string) {
  let message = (await database().query("SELECT * FROM mailbox_messages WHERE resend_id = $1", [resendId])).rows[0];
  if (!message) {
    const email = await receivedEmail(resendId);
    const attachments = (email.attachments ?? []).map(({ id, filename, content_type, size }) => ({ id, filename, content_type, size }));
    await database().query(
      `INSERT INTO mailbox_messages (id, direction, resend_id, message_id, from_address, to_addresses, cc_addresses, reply_to,
         subject, text_body, html_body, attachments, created_at, sent_at)
       VALUES ($1, 'inbound', $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $12)
       ON CONFLICT (resend_id) DO NOTHING`,
      [randomUUID(), resendId, email.message_id ?? null, String(email.from), list(email.to), list(email.cc), list(email.reply_to),
        email.subject ?? "", email.text, email.html, JSON.stringify(attachments), email.created_at ?? new Date().toISOString()],
    );
    message = (await database().query("SELECT * FROM mailbox_messages WHERE resend_id = $1", [resendId])).rows[0];
  }
  if (message.forwarded_at) return;
  const recipients = forwardRecipients(emailConfig().address);
  if (!recipients.length) return;
  await forward(message, recipients);
  await database().query("UPDATE mailbox_messages SET forwarded_at = now() WHERE id = $1", [message.id]);
}

type StoredMessage = {
  id: string; resend_id: string; from_address: string; to_addresses: string[]; reply_to: string[];
  subject: string; text_body: string | null; html_body: string | null; created_at: Date; attachments: unknown[];
};

async function forward(message: StoredMessage, recipients: string[]) {
  const details = [
    ["От", message.from_address],
    ["Кому", message.to_addresses.join(", ")],
    ["Дата", new Date(message.created_at).toUTCString()],
    ["Тема", message.subject],
  ];
  const attachments = message.attachments.length ? await receivedAttachments(message.resend_id) : [];
  await sendEmail({
    to: recipients,
    reply_to: message.reply_to.length ? message.reply_to : message.from_address,
    subject: `Fwd: ${message.subject}`,
    text: `---------- Пересланное письмо ----------\n${details.map(([label, value]) => `${label}: ${value}`).join("\n")}\n\n${message.text_body ?? ""}`,
    html: message.html_body ? `<p style="color:#555">---------- Пересланное письмо ----------<br>${details.map(([label, value]) => `${label}: ${escape(value)}`).join("<br>")}</p>${message.html_body}` : undefined,
    attachments: attachments.filter((file) => file.download_url).map((file) => ({ filename: file.filename, path: file.download_url!, content_type: file.content_type })),
  }, `mailbox-forward-${message.resend_id}`);
}
