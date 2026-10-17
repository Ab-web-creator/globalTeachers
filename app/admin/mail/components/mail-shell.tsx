import Link from "next/link";
import type { ReactNode } from "react";
import { ComposeMailIcon, InboxIcon, SentMailIcon, SpamMailIcon, CandidateGroupIcon, ClientCheckIcon, BriefcaseIcon, SupportCrownIcon, SnowflakeIcon, DeleteApplicationIcon } from "@/app/components/svg";
import { folderMessageCounts } from "../../../../lib/mailbox/messages";
import AdminNav from "../../components/admin-nav";

type Section = "inbox" | "sent" | "candidates" | "frozen" | "start-clients" | "pro-clients" | "vip-clients" | "spam" | "trash" | "new";
type Props = { active: Section | null; unread: number; mailbox: string; showLogout: boolean; children: ReactNode };

function FolderLink({ href, current, icon, label, count }: { href: string; current: boolean; icon: ReactNode; label: string; count?: { total: number; unread: number } }) {
  const unread = count?.unread ?? 0;
  return (
    <Link href={href} aria-current={current ? "page" : undefined} className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold ${current ? "bg-brand-100 text-brand-800" : "hover:bg-white"}`}>
      <span className="flex items-center gap-2"><span className="shrink-0 text-blue-600">{icon}</span>{label}</span>
      <span className="flex w-8 shrink-0 items-center justify-center tabular-nums">
        {unread > 0 ? (
          <span aria-label={`Непрочитанных писем: ${unread}`} className="shrink-0 rounded-full bg-brand-500 px-2 py-0.5 text-xs font-medium text-white">{unread}</span>
        ) : (
          <span aria-label={`Всего писем: ${count?.total ?? 0}`} className="shrink-0 text-sm font-normal text-neutral-500">{count?.total ?? 0}</span>
        )}
      </span>
    </Link>
  );
}

/** Mail app frame: the sidebar stays in place while the content pane scrolls on its own. */
export default async function MailShell({ active, unread, mailbox, showLogout, children }: Props) {
  const folderCounts = await folderMessageCounts().catch(() => ({} as Awaited<ReturnType<typeof folderMessageCounts>>));
  return (
    <div className="flex min-h-dvh flex-col bg-brand-50 text-base text-brand-700 lg:h-dvh">
      <AdminNav active="mail" unread={unread} showLogout={showLogout} />
      <main className="mx-auto w-full max-w-400 px-6 sm:px-10 lg:px-16 xl:px-20 flex min-h-0 flex-1 flex-col pt-3 pb-6">
        <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[auto_1fr] gap-4 lg:grid-cols-[13rem_minmax(0,1fr)] lg:grid-rows-1 lg:gap-3">
          <aside className="flex flex-col gap-4">
            <Link href="/admin/mail/new" aria-current={active === "new" ? "page" : undefined} className="flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-3 text-sm font-medium text-white hover:bg-brand-600"><ComposeMailIcon />Написать письмо</Link>
            <nav aria-label="Папки" className="flex flex-wrap gap-1 lg:flex-col">
              <FolderLink href="/admin/mail" current={active === "inbox"} icon={<InboxIcon />} label="Входящие" count={folderCounts.inbox} />
              <FolderLink href="/admin/mail?folder=candidates" current={active === "candidates"} icon={<CandidateGroupIcon className="size-5 shrink-0" />} label="Candidates" count={folderCounts.candidates} />
              <FolderLink href="/admin/mail?folder=start-clients" current={active === "start-clients"} icon={<ClientCheckIcon className="size-5 shrink-0" />} label="Клиенты START" count={folderCounts["start-clients"]} />
              <FolderLink href="/admin/mail?folder=pro-clients" current={active === "pro-clients"} icon={<BriefcaseIcon className="size-5 shrink-0" />} label="Клиенты PRO" count={folderCounts["pro-clients"]} />
              <FolderLink href="/admin/mail?folder=vip-clients" current={active === "vip-clients"} icon={<SupportCrownIcon className="size-5 shrink-0" />} label="VIP клиенты" count={folderCounts["vip-clients"]} />
              <FolderLink href="/admin/mail?folder=frozen" current={active === "frozen"} icon={<SnowflakeIcon className="size-5 shrink-0" />} label="Замороженные" count={folderCounts.frozen} />
              <FolderLink href="/admin/mail?folder=sent" current={active === "sent"} icon={<SentMailIcon />} label="Отправленные" count={folderCounts.sent} />
              <FolderLink href="/admin/mail?folder=spam" current={active === "spam"} icon={<SpamMailIcon />} label="Спам" count={folderCounts.spam} />
              <FolderLink href="/admin/mail?folder=trash" current={active === "trash"} icon={<DeleteApplicationIcon className="size-5 shrink-0" />} label="Корзина" count={folderCounts.trash} />
            </nav>
            {mailbox && <p className="hidden px-4 text-sm break-all text-neutral-500 lg:block">{mailbox}</p>}
          </aside>
          <section className="flex min-h-0 flex-col overflow-hidden rounded-3xl border border-brand-100 bg-white">{children}</section>
        </div>
      </main>
    </div>
  );
}
