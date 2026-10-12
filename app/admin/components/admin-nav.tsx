import Link from "next/link";

type Props = { active: "applications" | "mail"; unread?: number; showLogout: boolean };

export default function AdminNav({ active, unread = 0, showLogout }: Props) {
  const tab = (current: boolean) => `rounded-xl px-4 py-2 text-sm ${current ? "bg-white font-medium shadow-sm" : "text-brand-600 hover:bg-white/60"}`;
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <Link href="/" className="text-sm text-brand-600">← TeacherNavigator</Link>
      <div className="flex items-center gap-2">
        <nav aria-label="Разделы администратора" className="flex gap-1">
          <Link href="/admin" aria-current={active === "applications" ? "page" : undefined} className={tab(active === "applications")}>Заявки</Link>
          <Link href="/admin/mail" aria-current={active === "mail" ? "page" : undefined} className={tab(active === "mail")}>
            Почта{unread > 0 && <span className="ml-2 rounded-full bg-brand-500 px-2 py-0.5 text-xs text-white">{unread}</span>}
          </Link>
        </nav>
        {showLogout && <form action="/admin/logout" method="post"><button className="rounded-xl border border-brand-200 bg-white px-4 py-2 text-sm">Выйти</button></form>}
      </div>
    </div>
  );
}
