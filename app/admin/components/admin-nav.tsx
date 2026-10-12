import Link from "next/link";
import type { ReactNode } from "react";
import { BrandLogo } from "@/app/components/svg";

type Props = { active?: "applications" | "mail"; unread?: number; showLogout?: boolean; showTabs?: boolean };

function Tab({ href, current, children }: { href: string; current: boolean; children: ReactNode }) {
  return (
    <Link href={href} aria-current={current ? "page" : undefined} className={`relative flex h-16 items-center gap-2 px-3 text-base font-semibold sm:px-5 sm:text-lg ${current ? "text-brand-700" : "text-neutral-500 hover:text-brand-700"}`}>
      {children}
      {current && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-brand-500 sm:inset-x-5" aria-hidden="true" />}
    </Link>
  );
}

export default function AdminNav({ active, unread = 0, showLogout = false, showTabs = true }: Props) {
  return (
    <header className="sticky top-0 z-10 shrink-0 border-b border-brand-100 bg-white">
      <div className="mx-auto w-full max-w-400 px-6 sm:px-10 lg:px-16 xl:px-20 grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-4">
        <Link href="/admin" aria-label="Админ — TeacherNavigator" className="justify-self-start">
          <BrandLogo className="w-20" aria-hidden="true" />
        </Link>
        {showTabs && (
          <nav aria-label="Разделы администратора" className="flex">
            <Tab href="/admin" current={active === "applications"}>Заявки</Tab>
            <Tab href="/admin/mail" current={active === "mail"}>
              Почта{unread > 0 && <span className="rounded-full bg-brand-500 px-2 py-0.5 text-xs font-medium text-white">{unread}</span>}
            </Tab>
          </nav>
        )}
        <div className="col-start-3 flex items-center gap-2 justify-self-end">
          <Link href="/" className="hidden rounded-xl px-3 py-2 text-lg font-semibold text-neutral-500 hover:bg-brand-50 hover:text-brand-700 md:block">На сайт ↗</Link>
          {showLogout && <form action="/admin/logout" method="post"><button className="rounded-xl border border-brand-200 px-4 py-2 text-lg font-semibold hover:bg-brand-50">Выйти</button></form>}
        </div>
      </div>
    </header>
  );
}
