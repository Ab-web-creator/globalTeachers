import Link from "next/link";
import type { MailMessage } from "../../../../lib/mailbox/messages";
import { DeleteApplicationIcon, MarkUnreadIcon } from "@/app/components/svg";
import MessageActionButton from "./message-action-button";

function date(value: Date) {
  return new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(value);
}

function size(bytes?: number) {
  if (!bytes) return "";
  return bytes < 1024 * 1024 ? `${Math.ceil(bytes / 1024)} КБ` : `${(bytes / 1024 / 1024).toFixed(1)} МБ`;
}

// Received HTML is untrusted: render it in a sandbox without scripts, forms or access to the admin page.
function sandboxedHtml(html: string) {
  return `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: https: cid:; style-src 'unsafe-inline'; font-src data: https:"><base target="_blank"><style>body{margin:0;padding:24px;font-family:system-ui,sans-serif;color:#1f2937;overflow-wrap:anywhere}img{max-width:100%;height:auto}</style></head><body>${html}</body></html>`;
}

// readOnly is the no-login view from a Gmail copy: no actions, and attachments are listed by name only.
export default function MessageView({ message, readOnly = false }: { message: MailMessage; readOnly?: boolean }) {
  const inbound = message.direction === "inbound";
  const rows = [
    [inbound ? "От" : "Кому", inbound ? message.from_address : message.to_addresses.join(", ")],
    ...(inbound ? [["Кому", message.to_addresses.join(", ")]] : []),
    ...(message.cc_addresses.length ? [["Копия", message.cc_addresses.join(", ")]] : []),
    ...(message.reply_to.length ? [["Ответить", message.reply_to.join(", ")]] : []),
  ];
  const folder = inbound ? "/admin/mail" : "/admin/mail?folder=sent";
  const heading = readOnly
    ? <p className="text-sm text-neutral-500">Просмотр по ссылке из копии письма</p>
    : <Link href={folder} className="text-sm text-brand-600">← {inbound ? "Входящие" : "Отправленные"}</Link>;
  const actions = readOnly ? (
    <Link href={`/admin/mail/${message.id}`} className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">Ответить в админке</Link>
  ) : (
    <div className="flex items-center gap-2">
      {inbound && <MessageActionButton id={message.id} endpoint="/admin/mail/unread" returnTo="/admin/mail" icon={<MarkUnreadIcon className="size-4" />} label="Отметить непрочитанным" busyLabel="Отмечаем…" />}
      <MessageActionButton id={message.id} endpoint="/admin/mail/delete" returnTo={folder} icon={<DeleteApplicationIcon className="size-4" />} label="Удалить" busyLabel="Удаляем…" confirmation="Удалить это письмо навсегда? Это действие нельзя отменить." danger />
      <Link href={`/admin/mail/new?${new URLSearchParams({ reply: message.id })}`} className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">Ответить</Link>
    </div>
  );
  return (
    <article className="flex min-h-0 flex-1 flex-col">
      <header className="shrink-0 border-b border-brand-100 px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {heading}
          {actions}
        </div>
        <h1 className="mt-3 text-xl font-semibold wrap-break-word">{message.subject || "(без темы)"}</h1>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-x-6 gap-y-1 text-sm">
          <dl className="grid min-w-0 grid-cols-[auto_1fr] gap-x-3">
            {rows.map(([label, value]) => (
              <div key={label} className="contents"><dt className="text-neutral-500">{label}</dt><dd className="wrap-break-word">{value}</dd></div>
            ))}
          </dl>
          <p className="text-neutral-500">{date(new Date(message.created_at))} UTC</p>
        </div>
        {message.attachments.length > 0 && (
          <ul aria-label="Вложения" className="mt-3 flex flex-wrap gap-2">
            {message.attachments.map((file) => (
              <li key={file.id}>
                {readOnly ? <span className="inline-block rounded-xl border border-brand-200 px-3 py-1.5 text-sm">📎 {file.filename} <span className="text-neutral-500">{size(file.size)}</span></span> : <a href={`/admin/mail/attachment?${new URLSearchParams({ message: message.id, attachment: file.id })}`} target="_blank" rel="noreferrer" className="inline-block rounded-xl border border-brand-200 px-3 py-1.5 text-sm hover:bg-brand-50">
                  📎 {file.filename} <span className="text-neutral-500">{size(file.size)}</span>
                </a>}
              </li>
            ))}
          </ul>
        )}
      </header>
      {message.html_body ? (
        <iframe title="Текст письма" sandbox="allow-popups allow-popups-to-escape-sandbox" srcDoc={sandboxedHtml(message.html_body)} className="h-[70dvh] w-full lg:h-auto lg:min-h-0 lg:flex-1" />
      ) : (
        <pre className="min-h-0 flex-1 overflow-y-auto p-6 font-sans text-sm leading-normal whitespace-pre-wrap wrap-break-word">{message.text_body || "(пустое письмо)"}</pre>
      )}
    </article>
  );
}
