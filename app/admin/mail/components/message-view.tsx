import ApplicationPaymentControl from "../../components/application-payment-control";
import { messagePaymentDetails } from "../../../../lib/admin/client-payment";
import Link from "next/link";
import type { MailMessage } from "../../../../lib/mailbox/messages";
import { DeleteApplicationIcon, MarkUnreadIcon, ReplyMailIcon, ReplyAllMailIcon, ForwardMailIcon } from "@/app/components/svg";
import MessageActionButton from "./message-action-button";
import SendKeyButton from "./send-key-button";

function size(bytes?: number) {
  if (!bytes) return "";
  return bytes < 1024 * 1024 ? `${Math.ceil(bytes / 1024)} КБ` : `${(bytes / 1024 / 1024).toFixed(1)} МБ`;
}

// Received HTML is untrusted: render it in a sandbox without scripts, forms or access to the admin page.
function sandboxedHtml(html: string) {
  return `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: https: cid:; style-src 'unsafe-inline'; font-src data: https:"><base target="_blank"><style>body{margin:0;padding:24px;font-family:system-ui,sans-serif;color:#1f2937;overflow-wrap:anywhere}img{max-width:100%;height:auto}</style></head><body>${html}</body></html>`;
}

// readOnly is the no-login view from a Gmail copy: no actions, and attachments are listed by name only.
export default async function MessageView({ message, readOnly = false, readingPane = false }: { message: MailMessage; readOnly?: boolean; readingPane?: boolean }) {
  const inbound = message.direction === "inbound";
  const payment = inbound && !readOnly ? await messagePaymentDetails(message.id) : null;
  const rows = [
    [inbound ? "От:" : "Кому:", inbound ? message.from_address : message.to_addresses.join(", ")],
    ...(inbound ? [["Кому:", message.to_addresses.join(", ")]] : []),
    ...(message.cc_addresses.length ? [["Копия", message.cc_addresses.join(", ")]] : []),
  ];
  const folder = message.folder === "trash" ? "/admin/mail?folder=trash" : inbound ? (message.folder === "frozen" ? "/admin/mail?folder=frozen" : message.folder === "candidates" ? "/admin/mail?folder=candidates" : message.folder === "vip-clients" ? "/admin/mail?folder=vip-clients" : message.folder === "pro-clients" ? "/admin/mail?folder=pro-clients" : message.folder === "start-clients" ? "/admin/mail?folder=start-clients" : message.folder === "spam" ? "/admin/mail?folder=spam" : "/admin/mail") : "/admin/mail?folder=sent";
  const heading = readOnly
    ? <p className="text-sm text-neutral-500">Просмотр по ссылке из копии письма</p>
    : <Link href={folder} className="text-sm text-brand-600">← {message.folder === "trash" ? "Корзина" : inbound ? (message.folder === "frozen" ? "Замороженные" : message.folder === "candidates" ? "Candidates" : message.folder === "vip-clients" ? "VIP клиенты" : message.folder === "pro-clients" ? "Клиенты PRO" : message.folder === "start-clients" ? "Клиенты START" : message.folder === "spam" ? "Спам" : "Входящие") : "Отправленные"}</Link>;
  const actions = readOnly ? (
    <Link href={`/admin/mail/${message.id}`} className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">Ответить в админке</Link>
  ) : (
    <div className="ml-auto flex min-w-0 flex-wrap items-center justify-end gap-2">
      {inbound && <SendKeyButton messageId={message.id} tier={payment?.contact_tier ?? (message.folder === "start-clients" ? "START" : message.folder === "pro-clients" ? "PRO" : message.folder === "vip-clients" ? "VIP" : undefined)} />}
      {payment && <ApplicationPaymentControl key={`${message.id}:${payment.paid_at}:${payment.tier}`} messageId={message.id} paid={Boolean(payment.paid_at)} initialTier={payment.tier} />}

    </div>
  );
  return (
    <article className="group/email flex min-h-0 flex-1 flex-col">
      <header className="relative shrink-0 border-b border-brand-100 px-6 py-4">
        {!readingPane && <div className="mb-3">{heading}</div>}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="min-w-0 flex-1 basis-64 text-xl font-semibold wrap-break-word">{message.subject || "(без темы)"}</h1>
          {actions}
        </div>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-x-6 gap-y-1 text-sm">
          <dl className="grid min-w-0 grid-cols-[auto_1fr] gap-x-1">
            {rows.map(([label, value]) => (
              <div key={label} className="contents"><dt className="text-neutral-500">{label}</dt><dd className="text-neutral-400 wrap-break-word">{value}</dd></div>
            ))}
          </dl>
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
        {!readOnly && (
          <div role="toolbar" aria-label="Действия с письмом" className="absolute bottom-0 left-1/2 z-10 flex -translate-x-1/2 translate-y-1/2 items-center gap-0 rounded-full border border-neutral-200 bg-white px-0.5 py-0 shadow-[0_0_2px_rgb(0_0_0/0.06)] transition-opacity [@media(hover:hover)]:pointer-events-none [@media(hover:hover)]:opacity-0 group-hover/email:pointer-events-auto group-hover/email:opacity-100 group-focus-within/email:pointer-events-auto group-focus-within/email:opacity-100">
            {message.folder !== "trash" && <>
              <MessageActionButton id={message.id} endpoint="/admin/mail/delete" returnTo={folder} icon={<DeleteApplicationIcon className="size-4" />} label="Удалить" busyLabel="Удаляем…" confirmation="Переместить письмо в корзину? Оно будет храниться там 14 дней." danger />
              <span aria-hidden="true" className="mx-0.5 h-4 border-l border-neutral-200" />
            </>}
            <Link href={`/admin/mail/new?reply=${message.id}`} aria-label="Ответить" title="Ответить" className="flex size-7 items-center justify-center rounded-full text-neutral-400 hover:text-neutral-500"><ReplyMailIcon className="size-4" /></Link>
            <Link href={`/admin/mail/new?reply=${message.id}&all=1`} aria-label="Ответить всем" title="Ответить всем" className="flex size-7 items-center justify-center rounded-full text-neutral-400 hover:text-neutral-500"><ReplyAllMailIcon className="size-4" /></Link>
            <Link href={`/admin/mail/new?forward=${message.id}`} aria-label="Переслать" title="Переслать" className="flex size-7 items-center justify-center rounded-full text-neutral-400 hover:text-neutral-500"><ForwardMailIcon className="size-4" /></Link>
            {inbound && <MessageActionButton id={message.id} endpoint="/admin/mail/unread" returnTo={folder} icon={<MarkUnreadIcon className="size-4" />} label="Отметить непрочитанным" busyLabel="Отмечаем…" />}
          </div>
        )}
      </header>
      {message.html_body ? (
        <iframe title="Текст письма" sandbox="allow-popups allow-popups-to-escape-sandbox" srcDoc={sandboxedHtml(message.html_body)} className="h-[70dvh] w-full lg:h-auto lg:min-h-0 lg:flex-1" />
      ) : (
        <pre className="min-h-0 flex-1 overflow-y-auto px-6 pt-8 pb-6 font-sans text-sm leading-normal whitespace-pre-wrap wrap-break-word">{message.text_body || "(пустое письмо)"}</pre>
      )}
    </article>
  );
}
