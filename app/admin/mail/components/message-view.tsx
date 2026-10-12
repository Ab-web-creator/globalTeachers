import Link from "next/link";
import type { MailMessage } from "../../../../lib/mailbox/messages";

function date(value: Date) {
  return new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(value);
}

function size(bytes?: number) {
  if (!bytes) return "";
  return bytes < 1024 * 1024 ? `${Math.ceil(bytes / 1024)} КБ` : `${(bytes / 1024 / 1024).toFixed(1)} МБ`;
}

// Received HTML is untrusted: render it in a sandbox without scripts, forms or access to the admin page.
function sandboxedHtml(html: string) {
  return `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: https: cid:; style-src 'unsafe-inline'; font-src data: https:"><base target="_blank"><style>body{margin:0;font-family:system-ui,sans-serif;color:#1f2937;overflow-wrap:anywhere}img{max-width:100%;height:auto}</style></head><body>${html}</body></html>`;
}

export default function MessageView({ message }: { message: MailMessage }) {
  const rows = [
    ["От", message.from_address],
    ["Кому", message.to_addresses.join(", ")],
    ...(message.cc_addresses.length ? [["Копия", message.cc_addresses.join(", ")]] : []),
    ...(message.reply_to.length ? [["Ответить", message.reply_to.join(", ")]] : []),
    ["Дата", `${date(message.created_at)} UTC`],
  ];
  return (
    <article className="mt-6 rounded-3xl border border-brand-100 bg-white p-6">
      <Link href={message.direction === "inbound" ? "/admin/mail" : "/admin/mail?folder=sent"} className="text-sm text-brand-600">← {message.direction === "inbound" ? "Входящие" : "Отправленные"}</Link>
      <h1 className="mt-4 text-2xl font-semibold wrap-break-word">{message.subject || "(без темы)"}</h1>
      <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="contents"><dt className="text-neutral-500">{label}</dt><dd className="wrap-break-word">{value}</dd></div>
        ))}
      </dl>
      <div className="mt-6 border-t border-brand-100 pt-6">
        {message.html_body ? (
          <iframe title="Текст письма" sandbox="allow-popups allow-popups-to-escape-sandbox" srcDoc={sandboxedHtml(message.html_body)} className="h-[70dvh] w-full rounded-xl border border-brand-100" />
        ) : (
          <pre className="font-sans text-sm leading-normal whitespace-pre-wrap wrap-break-word">{message.text_body || "(пустое письмо)"}</pre>
        )}
      </div>
      {message.attachments.length > 0 && (
        <section className="mt-6 border-t border-brand-100 pt-6" aria-label="Вложения">
          <h2 className="text-sm font-semibold">Вложения</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {message.attachments.map((file) => (
              <li key={file.id}>
                <a href={`/admin/mail/attachment?${new URLSearchParams({ message: message.id, attachment: file.id })}`} target="_blank" rel="noreferrer" className="inline-block rounded-xl border border-brand-200 px-4 py-2 text-sm hover:bg-brand-50">
                  📎 {file.filename} <span className="text-neutral-500">{size(file.size)}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
