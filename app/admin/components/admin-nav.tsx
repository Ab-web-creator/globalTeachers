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

type Props = { active?: "applications" | "mail" | "analytics"; unread?: number; showLogout?: boolean; showTabs?: boolean };

function Tab({ href, current, children }: { href: string; current: boolean; children: ReactNode }) {
  return (
    <Link href={href} aria-current={current ? "page" : undefined} className={`${styles.tab} flex shrink-0 items-center gap-2 rounded-xl py-2.5 text-base font-medium transition ${current ? "bg-brand-500 px-5 text-white shadow-sm" : "px-3 text-neutral-500 hover:bg-brand-50 hover:text-brand-700"}`}>
      {children}
    </Link>
  );
}

export default async function AdminNav({ active, unread = 0, showLogout = false, showTabs = true }: Props) {
  const timeZone = validTimeZone((await cookies()).get(adminTimeZoneCookie)?.value);
  return (
    <header className="sticky top-0 z-30 shrink-0 border-b border-brand-100 bg-white/95 backdrop-blur-lg">
      <AdminTimeZoneSync serverTimeZone={timeZone} />
      {showTabs && <AdminVisitorExclusion />}
      {showTabs && <IncomingCalls />}
      <div className="mx-auto flex w-full max-w-400 flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-10 lg:px-16 xl:px-20">
        <Link href="/admin" aria-label="Админ — TeacherNavigator" className="flex items-center gap-4">
          <BrandLogo className="w-24" aria-hidden="true" />
          <span className="hidden border-l border-brand-200 pl-4 text-sm font-medium tracking-widest text-neutral-400 uppercase lg:block">Рабочее пространство</span>
        </Link>
        {showTabs && (
          <nav aria-label="Разделы администратора" className="hidden gap-1 overflow-x-auto rounded-2xl bg-brand-50 p-1 sm:flex sm:w-auto">
            <Tab href="/admin" current={active === "applications"}>Заявки</Tab>
            <Tab href="/admin/analytics" current={active === "analytics"}>Посещаемость</Tab>
            <Tab href="/admin/mail" current={active === "mail"}>
              Почта{unread > 0 && <span className={`rounded-full px-2 py-0.5 text-base font-medium ${active === "mail" ? "bg-white/20 text-white" : "bg-brand-100 text-brand-600"}`}>{unread}</span>}
            </Tab>
          </nav>
        )}
        <div className="flex items-center gap-2">
          {showLogout && <form action="/admin/logout" method="post"><button className="rounded-xl border border-brand-200 px-4 py-2 text-base font-medium hover:bg-brand-50">Выйти</button></form>}
          <Link href="/" className="whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium text-neutral-500 hover:bg-brand-50 hover:text-brand-700 sm:text-base">На сайт ↗</Link>
          {showTabs && <AdminMobileMenu />}
        </div>
      </div>
    </header>
  );
}
