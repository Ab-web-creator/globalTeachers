import Link from "next/link";
import type { ReactNode } from "react";
import { ComposeMailIcon, InboxIcon, SentMailIcon, SpamMailIcon } from "@/app/components/svg";
import { folderUnreadCounts } from "../../../../lib/mailbox/messages";
import AdminNav from "../../components/admin-nav";

type Section = "inbox" | "sent" | "start-clients" | "pro-clients" | "vip-clients" | "spam" | "new";
type Props = { active: Section | null; unread: number; mailbox: string; showLogout: boolean; children: ReactNode };

function FolderLink({ href, current, icon, label, count }: { href: string; current: boolean; icon: ReactNode; label: string; count?: number }) {
  return (
    <Link href={href} aria-current={current ? "page" : undefined} className={`flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-lg ${current ? "bg-brand-100 font-semibold text-brand-800" : "hover:bg-white"}`}>
      <span className="flex items-center gap-3">{icon}{label}</span>
      {!!count && <span className="rounded-full bg-brand-500 px-2 py-0.5 text-xs font-medium text-white">{count}</span>}
    </Link>
  );
}

/** Mail app frame: the sidebar stays in place while the content pane scrolls on its own. */
export default async function MailShell({ active, unread, mailbox, showLogout, children }: Props) {
  const folderCounts = await folderUnreadCounts().catch(() => ({} as Awaited<ReturnType<typeof folderUnreadCounts>>));
  return (
    <div className="flex min-h-dvh flex-col bg-brand-50 text-base text-brand-700 lg:h-dvh">
      <AdminNav active="mail" unread={unread} showLogout={showLogout} />
      <main className="mx-auto w-full max-w-400 px-6 sm:px-10 lg:px-16 xl:px-20 flex min-h-0 flex-1 flex-col py-6">
        <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[auto_1fr] gap-4 lg:grid-cols-[15rem_minmax(0,1fr)] lg:grid-rows-1 lg:gap-6">
          <aside className="flex flex-col gap-4">
            <Link href="/admin/mail/new" aria-current={active === "new" ? "page" : undefined} className="flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-3 text-sm font-medium text-white hover:bg-brand-600"><ComposeMailIcon />Написать письмо</Link>
            <nav aria-label="Папки" className="flex flex-wrap gap-1 lg:flex-col">
              <FolderLink href="/admin/mail" current={active === "inbox"} icon={<InboxIcon />} label="Входящие" count={folderCounts.inbox} />
              <FolderLink href="/admin/mail?folder=start-clients" current={active === "start-clients"} icon={<InboxIcon />} label="Клиенты START" count={folderCounts["start-clients"]} />
              <FolderLink href="/admin/mail?folder=pro-clients" current={active === "pro-clients"} icon={<InboxIcon />} label="Клиенты PRO" count={folderCounts["pro-clients"]} />
              <FolderLink href="/admin/mail?folder=vip-clients" current={active === "vip-clients"} icon={<InboxIcon />} label="VIP клиенты" count={folderCounts["vip-clients"]} />
              <FolderLink href="/admin/mail?folder=sent" current={active === "sent"} icon={<SentMailIcon />} label="Отправленные" />
              <FolderLink href="/admin/mail?folder=spam" current={active === "spam"} icon={<SpamMailIcon />} label="Спам" />
            </nav>
            {mailbox && <p className="hidden px-4 text-sm break-all text-neutral-500 lg:block">{mailbox}</p>}
          </aside>
          <section className="flex min-h-0 flex-col overflow-hidden rounded-3xl border border-brand-100 bg-white">{children}</section>
        </div>
      </main>
    </div>
  );
}
