import Link from "next/link";
import type { ReactNode } from "react";
import { ComposeMailIcon, InboxIcon, SentMailIcon, SpamMailIcon, CandidateGroupIcon, ClientCheckIcon, BriefcaseIcon, SupportCrownIcon, SnowflakeIcon, DeleteApplicationIcon, FormSelectChevronIcon } from "@/app/components/svg";
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
  const folders: { section: Section; href: string; icon: ReactNode; label: string }[] = [
    { section: "inbox", href: "/admin/mail", icon: <InboxIcon />, label: "Входящие" },
    { section: "candidates", href: "/admin/mail?folder=candidates", icon: <CandidateGroupIcon className="size-5 shrink-0" />, label: "Candidates" },
    { section: "start-clients", href: "/admin/mail?folder=start-clients", icon: <ClientCheckIcon className="size-5 shrink-0" />, label: "Клиенты START" },
    { section: "pro-clients", href: "/admin/mail?folder=pro-clients", icon: <BriefcaseIcon className="size-5 shrink-0" />, label: "Клиенты PRO" },
    { section: "vip-clients", href: "/admin/mail?folder=vip-clients", icon: <SupportCrownIcon className="size-5 shrink-0" />, label: "VIP клиенты" },
    { section: "frozen", href: "/admin/mail?folder=frozen", icon: <SnowflakeIcon className="size-5 shrink-0" />, label: "Замороженные" },
    { section: "sent", href: "/admin/mail?folder=sent", icon: <SentMailIcon />, label: "Отправленные" },
    { section: "spam", href: "/admin/mail?folder=spam", icon: <SpamMailIcon />, label: "Спам" },
    { section: "trash", href: "/admin/mail?folder=trash", icon: <DeleteApplicationIcon className="size-5 shrink-0" />, label: "Корзина" },
  ];
  const current = folders.find((folder) => folder.section === active);
  const folderLinks = folders.map((folder) => (
    <FolderLink key={folder.section} href={folder.href} current={active === folder.section} icon={folder.icon} label={folder.label} count={folderCounts[folder.section as keyof typeof folderCounts]} />
  ));
  return (
    <div className="flex min-h-dvh flex-col bg-brand-50 text-base text-brand-700 lg:h-dvh">
      <AdminNav active="mail" unread={unread} showLogout={showLogout} />
      <main className="mx-auto w-full max-w-400 px-6 sm:px-10 lg:px-16 xl:px-20 flex min-h-0 flex-1 flex-col pt-3 pb-6">
        <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[auto_1fr] gap-4 lg:grid-cols-[13rem_minmax(0,1fr)] lg:grid-rows-1 lg:gap-3">
          <aside className="flex items-start gap-3 lg:flex-col lg:items-stretch lg:gap-4">
            <Link href="/admin/mail/new" aria-current={active === "new" ? "page" : undefined} className="order-last flex size-11.5 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-500 text-sm font-medium text-white hover:bg-brand-600 lg:order-none lg:h-auto lg:w-auto lg:px-4 lg:py-3"><ComposeMailIcon /><span className="sr-only lg:not-sr-only">Написать письмо</span></Link>
            <details key={active ?? "none"} className="group min-w-0 flex-1 rounded-xl border border-brand-100 bg-white lg:hidden">
              <summary className="relative flex cursor-pointer list-none items-center gap-2 rounded-xl py-3 pr-12 pl-4 text-sm font-semibold focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-500 [&::-webkit-details-marker]:hidden">
                {current ? <><span className="shrink-0 text-blue-600">{current.icon}</span>{current.label}</> : "Папки"}
                <FormSelectChevronIcon className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-brand-600 transition-transform group-open:rotate-180" />
              </summary>
              <nav aria-label="Папки" className="flex flex-col gap-1 border-t border-brand-100 p-1">{folderLinks}</nav>
            </details>
            <nav aria-label="Папки" className="hidden flex-col gap-1 lg:flex">{folderLinks}</nav>
            {mailbox && <p className="hidden px-4 text-sm break-all text-neutral-500 lg:block">{mailbox}</p>}
          </aside>
          <section className="flex min-h-0 flex-col overflow-hidden rounded-3xl border border-brand-100 bg-white">{children}</section>
        </div>
      </main>
    </div>
  );
}
