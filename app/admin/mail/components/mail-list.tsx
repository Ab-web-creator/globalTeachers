import LocalTime from "../../components/local-time";
import Link from "next/link";
import { mailPageSize, type listMessages, type MailFolder } from "../../../../lib/mailbox/messages";

// Show "Anna Petrova" rather than "Anna Petrova <anna@example.org>"; the full address is on the message page.
function displayName(value: string) {
  return value.replace(/\s*<[^<>]+>\s*$/, "").replace(/^"(.*)"$/, "$1").trim() || value;
}

type Props = { folder: MailFolder; data: Awaited<ReturnType<typeof listMessages>> | null };

export default function MailList({ folder, data }: Props) {
  const url = (page: number) => `/admin/mail?${new URLSearchParams({ folder, page: String(page) })}`;
  return (
    <>
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-brand-100 px-6 py-4">
        <h1 className="text-xl font-semibold">{folder === "vip-clients" ? "VIP клиенты" : folder === "pro-clients" ? "Клиенты PRO" : folder === "start-clients" ? "Клиенты START" : folder === "inbox" ? "Входящие" : folder === "spam" ? "Спам" : "Отправленные"}</h1>
        {!!data?.total && <p className="text-sm text-neutral-500">{(data.page - 1) * mailPageSize + 1}–{Math.min(data.page * mailPageSize, data.total)} из {data.total} · местное время</p>}
      </header>
      {!data ? (
        <p role="alert" className="m-6 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm">Не удалось загрузить письма. Проверьте DATABASE_URL и выполните npm run db:migrate.</p>
      ) : (
        <>
          <ul className="min-h-0 flex-1 divide-y divide-brand-100 overflow-y-auto">
            {data.messages.map((message) => {
              const unread = folder !== "sent" && !message.read_at;
              return (
                <li key={message.id}>
                  <Link href={`/admin/mail/${message.id}`} className={`grid grid-cols-1 gap-x-4 gap-y-1 px-6 py-3 hover:bg-brand-50 sm:grid-cols-[13rem_minmax(0,1fr)_auto] ${unread ? "bg-brand-50/60" : ""}`}>
                    <span className={`flex min-w-0 items-center gap-2 truncate ${unread ? "font-semibold" : ""}`}>
                      {unread && <span className="size-2 shrink-0 rounded-full bg-brand-500" aria-label="Не прочитано" />}
                      <span className="truncate">{folder !== "sent" ? displayName(message.from_address) : `Кому: ${message.to_addresses.map(displayName).join(", ")}`}</span>
                    </span>
                    <span className="min-w-0 truncate text-sm">
                      <span className={unread ? "font-semibold" : ""}>{message.subject || "(без темы)"}</span>
                      {message.snippet && <span className="text-neutral-500"> — {message.snippet}</span>}
                    </span>
                    <span className="flex items-center gap-2 text-sm whitespace-nowrap text-neutral-500">
                      {message.has_attachments && <span aria-label="Есть вложения">📎</span>}
                      <LocalTime value={new Date(message.created_at).toISOString()} compact />
                    </span>
                  </Link>
                </li>
              );
            })}
            {!data.total && <li className="p-10 text-center text-neutral-500">{(folder === "start-clients" || folder === "pro-clients" || folder === "vip-clients") ? "Заявок на оплату пока нет." : folder === "inbox" ? "Входящих писем пока нет." : folder === "spam" ? "Спама нет." : "Отправленных писем пока нет."}</li>}
          </ul>
          {data.pages > 1 && (
            <nav aria-label="Страницы писем" className="flex shrink-0 items-center justify-between gap-4 border-t border-brand-100 px-6 py-3 text-sm">
              {data.page > 1 ? <Link href={url(data.page - 1)} className="text-brand-600">← Назад</Link> : <span />}
              <span className="text-base">Страница {data.page} из {data.pages}</span>
              {data.page < data.pages ? <Link href={url(data.page + 1)} className="text-brand-600">Далее →</Link> : <span />}
            </nav>
          )}
        </>
      )}
    </>
  );
}
