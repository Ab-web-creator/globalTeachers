import Link from "next/link";
import type { listMessages, MailFolder } from "../../../../lib/mailbox/messages";

function date(value: Date) {
  return new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(value);
}

type Props = { folder: MailFolder; mailbox: string; data: Awaited<ReturnType<typeof listMessages>> | null };

export default function MailList({ folder, mailbox, data }: Props) {
  const tab = (current: boolean) => `rounded-xl px-4 py-2 text-sm ${current ? "bg-brand-500 text-white" : "border border-brand-200 bg-white"}`;
  const url = (page: number) => `/admin/mail?${new URLSearchParams({ folder, page: String(page) })}`;
  return (
    <>
      <header className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Почта</h1>
          <p className="mt-2 text-sm text-neutral-500">{mailbox ? `Письма для ${mailbox}.` : "Укажите CONSULTATION_EMAIL_FROM."} Все даты указаны в UTC.</p>
        </div>
        <Link href="/admin/mail/new" className="rounded-xl bg-brand-500 px-5 py-3 text-sm font-medium text-white hover:bg-brand-600">Написать письмо</Link>
      </header>
      <nav aria-label="Папки" className="mt-6 flex gap-2">
        <Link href="/admin/mail" aria-current={folder === "inbox" ? "page" : undefined} className={tab(folder === "inbox")}>Входящие{data?.unread ? ` (${data.unread})` : ""}</Link>
        <Link href="/admin/mail?folder=sent" aria-current={folder === "sent" ? "page" : undefined} className={tab(folder === "sent")}>Отправленные</Link>
      </nav>
      {!data ? (
        <p role="alert" className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm">Не удалось загрузить письма. Проверьте DATABASE_URL и выполните npm run db:migrate.</p>
      ) : (
        <>
          <ul className="mt-4 divide-y divide-brand-100 overflow-hidden rounded-2xl border border-brand-100 bg-white">
            {data.messages.map((message) => {
              const unread = folder === "inbox" && !message.read_at;
              return (
                <li key={message.id}>
                  <Link href={`/admin/mail/${message.id}`} className="grid gap-1 px-5 py-4 hover:bg-brand-50 sm:grid-cols-[14rem_1fr_auto] sm:gap-4">
                    <span className={`truncate ${unread ? "font-semibold" : ""}`}>{folder === "inbox" ? message.from_address : `Кому: ${message.to_addresses.join(", ")}`}</span>
                    <span className="min-w-0 truncate text-sm">
                      <span className={unread ? "font-semibold" : ""}>{message.subject || "(без темы)"}</span>
                      {message.has_attachments && <span className="ml-2 text-neutral-400" aria-label="Есть вложения">📎</span>}
                      {message.snippet && <span className="text-neutral-500"> — {message.snippet}</span>}
                    </span>
                    <span className="text-sm whitespace-nowrap text-neutral-500">{date(message.created_at)}</span>
                  </Link>
                </li>
              );
            })}
            {!data.total && <li className="p-8 text-center text-neutral-500">{folder === "inbox" ? "Входящих писем пока нет." : "Отправленных писем пока нет."}</li>}
          </ul>
          <nav aria-label="Страницы писем" className="mt-6 flex items-center justify-between gap-4 text-sm">
            {data.page > 1 ? <Link href={url(data.page - 1)} className="text-brand-600">← Назад</Link> : <span />}
            <span>Страница {data.page} из {data.pages}</span>
            {data.page < data.pages ? <Link href={url(data.page + 1)} className="text-brand-600">Далее →</Link> : <span />}
          </nav>
        </>
      )}
    </>
  );
}
