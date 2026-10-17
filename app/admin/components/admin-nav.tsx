import Link from "next/link";
import type { ReactNode } from "react";
import { BrandLogo } from "@/app/components/svg";
import { AdminTimeZoneSync } from "./local-time";
import { cookies } from "next/headers";
import { adminTimeZoneCookie, validTimeZone } from "../../../lib/admin/timezone";
import AdminVisitorExclusion from "./admin-visitor-exclusion";
import styles from "./admin-nav.module.css";
import IncomingCalls from "./incoming-calls";
import AdminMobileMenu from "./admin-mobile-menu";
import AdminHeader from "./admin-header";
import { unreadCount } from "../../../lib/mailbox/messages";

type Props = { active?: "applications" | "mail" | "analytics" | "clients" | "calendar"; unread?: number; showLogout?: boolean; showTabs?: boolean };

// The current or hovered section is underlined like the home page navigation.
function Tab({ href, current, badge, children }: { href: string; current: boolean; badge?: ReactNode; children: ReactNode }) {
  return (
    <Link href={href} aria-current={current ? "page" : undefined} className={`${styles.tab} group flex shrink-0 items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium transition ${current ? "text-brand-700" : "text-neutral-500 hover:text-brand-700"}`}>
      <span className={`decoration-current decoration-[3px] underline-offset-8 ${current ? "underline" : "group-hover:underline"}`}>{children}</span>
      {badge}
    </Link>
  );
}

export default async function AdminNav({ active, unread, showLogout = false, showTabs = true }: Props) {
  const timeZone = validTimeZone((await cookies()).get(adminTimeZoneCookie)?.value);
  const mailUnread = showTabs ? (unread ?? await unreadCount().catch(() => 0)) : 0;
  // Local development skips the login, but the button stays visible so the layout matches production.
  const logout = showLogout || (process.env.NODE_ENV === "development" && showTabs);
  return (
    <AdminHeader>
      <AdminTimeZoneSync serverTimeZone={timeZone} />
      {showTabs && <AdminVisitorExclusion />}
      {showTabs && <IncomingCalls />}
      <div className="mx-auto flex w-full max-w-400 flex-wrap items-center justify-between gap-3 px-5 py-1 sm:px-10 lg:px-16 xl:px-20">
        <Link href="/" aria-label="TeacherNavigator — на главную страницу сайта">
          <BrandLogo className="w-20" aria-hidden="true" />
        </Link>
        {showTabs && (
          <nav aria-label="Разделы администратора" className="hidden gap-1 overflow-x-auto uppercase sm:flex sm:w-auto">
            <Tab href="/admin" current={active === "applications" || active === "analytics"}>Заявки</Tab>
            <Tab href="/admin/clients" current={active === "clients"}>Клиенты</Tab>
            <Tab href="/admin/calendar" current={active === "calendar"}>Календарь</Tab>
            <Tab href="/admin/mail" current={active === "mail"} badge={mailUnread > 0 && <span className="relative -top-1.5 -ml-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-red-600 text-xs font-medium leading-none text-white">{mailUnread}</span>}>
              Почта
            </Tab>
          </nav>
        )}
        <div className="flex items-center gap-2">
          {logout && <form action="/admin/logout" method="post"><button className="rounded-xl border border-brand-200 px-4 py-2 text-base font-medium hover:bg-brand-50">Выйти</button></form>}
          {showTabs && <AdminMobileMenu active={active} logout={logout} />}
        </div>
      </div>
    </AdminHeader>
  );
}
