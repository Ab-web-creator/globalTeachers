"use client";

import Link from "next/link";
import { useState } from "react";
import { MenuToggleIcon } from "@/app/components/svg";

export default function AdminMobileMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative sm:hidden">
      <button type="button" aria-label={open ? "Закрыть меню" : "Открыть меню"} aria-expanded={open} aria-controls="admin-mobile-navigation" onClick={() => setOpen(!open)} className="flex size-10 items-center justify-center rounded-xl text-neutral-600 hover:bg-brand-50">
        <MenuToggleIcon open={open} />
      </button>
      {open && (
        <nav id="admin-mobile-navigation" aria-label="Разделы администратора" className="absolute top-full right-0 z-40 mt-2 w-56 rounded-xl border border-brand-100 bg-white p-2 shadow-lg">
          {[["/admin", "Заявки"], ["/admin/analytics", "Посещаемость"], ["/admin/mail", "Почта"], ["/admin/clients", "Клиенты"], ["/admin/calendar", "Календарь"]].map(([href, label]) => <Link key={href} href={href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-neutral-600 hover:bg-brand-50">{label}</Link>)}
        </nav>
      )}
    </div>
  );
}
