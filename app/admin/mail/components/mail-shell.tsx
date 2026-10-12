import Link from "next/link";
import type { ReactNode } from "react";
import AdminNav from "../../components/admin-nav";

type Section = "inbox" | "sent" | "new";
type Props = { active: Section | null; unread: number; mailbox: string; showLogout: boolean; children: ReactNode };

function FolderLink({ href, current, label, count }: { href: string; current: boolean; label: string; count?: number }) {
  return (
    <Link href={href} aria-current={current ? "page" : undefined} className={`flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-sm ${current ? "bg-brand-100 font-semibold text-brand-800" : "hover:bg-white"}`}>
      {label}
      {!!count && <span className="rounded-full bg-brand-500 px-2 py-0.5 text-xs font-medium text-white">{count}</span>}
    </Link>
  );
}

/** Mail app frame: the sidebar stays in place while the content pane scrolls on its own. */
export default function MailShell({ active, unread, mailbox, showLogout, children }: Props) {
  return (
    <main className="flex min-h-dvh flex-col bg-brand-50 px-4 py-6 text-brand-700 sm:px-8 lg:h-dvh">
      <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col">
        <AdminNav active="mail" unread={unread} showLogout={showLogout} />
        <div className="mt-6 grid min-h-0 flex-1 grid-cols-1 grid-rows-[auto_1fr] gap-4 lg:grid-cols-[15rem_minmax(0,1fr)] lg:grid-rows-1 lg:gap-6">
          <aside className="flex flex-col gap-4">
            <Link href="/admin/mail/new" aria-current={active === "new" ? "page" : undefined} className="rounded-xl bg-brand-500 px-4 py-3 text-center text-sm font-medium text-white hover:bg-brand-600">Написать письмо</Link>
            <nav aria-label="Папки" className="flex gap-1 lg:flex-col">
              <FolderLink href="/admin/mail" current={active === "inbox"} label="Входящие" count={unread} />
              <FolderLink href="/admin/mail?folder=sent" current={active === "sent"} label="Отправленные" />
            </nav>
            {mailbox && <p className="hidden px-4 text-xs break-all text-neutral-500 lg:block">{mailbox}</p>}
          </aside>
          <section className="flex min-h-0 flex-col overflow-hidden rounded-3xl border border-brand-100 bg-white">{children}</section>
        </div>
      </div>
    </main>
  );
}
