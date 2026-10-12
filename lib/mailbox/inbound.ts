import { randomUUID } from "node:crypto";
import { database } from "../consultation/database";
import { emailConfig, sendEmail } from "../consultation/email";
import { receivedAttachments, receivedEmail } from "./resend";
import { mailViewUrl } from "./view-link";

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

const previewLength = 300;

/** First lines of the email as plain text; the full email is read in the admin. */
function preview(message: StoredMessage) {
  const text = message.text_body || (message.html_body ?? "").replace(/<(style|script)[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ");
  const compact = text.replace(/\s+/g, " ").trim();
  return compact.length > previewLength ? `${compact.slice(0, previewLength).trimEnd()}…` : compact;
}

async function forward(message: StoredMessage, recipients: string[]) {
  const { origin } = emailConfig();
  const link = mailViewUrl(origin, message.id);
  const heading = "Это копия письма, которое получил TeacherNavigator";
  const details = [
    ["От", message.from_address],
    ["Кому", message.to_addresses.join(", ")],
    ["Тема", message.subject || "(без темы)"],
  ];
  const excerpt = preview(message);
  const attachments = message.attachments.length ? await receivedAttachments(message.resend_id) : [];
  const files = attachments.filter((file) => file.download_url);
  const row = ([label, value]: string[]) => `<tr><td style="padding:2px 12px 2px 0;color:#6b7280;vertical-align:top">${label}</td><td style="padding:2px 0;color:#111827">${escape(value)}</td></tr>`;
  await sendEmail({
    to: recipients,
    reply_to: message.reply_to.length ? message.reply_to : message.from_address,
    subject: `Копия: ${message.subject || "(без темы)"}`,
    text: [
      heading.toUpperCase(),
      "",
      ...details.map(([label, value]) => `${label}: ${value}`),
      "",
      excerpt ? `«${excerpt}»` : "(письмо без текста)",
      "",
      `Открыть письмо полностью: ${link}`,
      ...(files.length ? ["", `Вложения: ${files.map((file) => file.filename).join(", ")}`] : []),
    ].join("\n"),
    html: `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#111827;max-width:600px">
<p style="margin:0 0 16px;font-size:18px;font-weight:bold">${heading}</p>
<table style="border-collapse:collapse;font-size:14px;margin:0 0 16px">${details.map(row).join("")}</table>
<p style="margin:0 0 20px;padding:12px 16px;background:#f3f4f6;border-radius:8px;color:#374151">${excerpt ? `«${escape(excerpt)}»` : "(письмо без текста)"}</p>
<p style="margin:0 0 16px"><a href="${escape(link)}" style="display:inline-block;padding:12px 20px;background:#5750cf;color:#ffffff;text-decoration:none;border-radius:10px;font-weight:bold">Открыть письмо полностью</a></p>
${files.length ? `<p style="margin:0;font-size:13px;color:#6b7280">Вложения: ${files.map((file) => escape(file.filename)).join(", ")}</p>` : ""}
</div>`,
    attachments: files.map((file) => ({ filename: file.filename, path: file.download_url!, content_type: file.content_type })),
  }, `mailbox-forward-${message.resend_id}`);
}
