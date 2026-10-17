"use client";

import Link from "next/link";
import styles from "./admin-mobile-menu.module.css";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MenuToggleIcon, MobileMenuCloseIcon } from "@/app/components/svg";
import MenuLanguages from "@/app/components/home/menu-languages";

// Render above the sticky header so the menu reaches the viewport edges.
export default function AdminMobileMenu({ active, logout = false }: { active?: string; logout?: boolean }) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog?.showModal();
    closeRef.current?.focus({ preventScroll: true });
    const desktop = window.matchMedia("(min-width: 640px)");
    const onResize = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener("change", onResize);
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      desktop.removeEventListener("change", onResize);
      trigger?.focus({ preventScroll: true });
    };
  }, [open]);
  return (
    <div className="sm:hidden">
      <button ref={triggerRef} type="button" aria-label={open ? "Закрыть меню" : "Открыть меню"} aria-expanded={open} aria-controls="admin-mobile-navigation" onClick={() => setOpen(!open)} className="flex size-10 items-center justify-center rounded-xl text-neutral-600 hover:bg-brand-50">
        <MenuToggleIcon open={open} />
      </button>
      {open && createPortal(
        <dialog ref={dialogRef} id="admin-mobile-navigation" aria-label="Меню администратора" onClick={event => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
            setOpen(false);
          }
        }} onCancel={event => { event.preventDefault(); setOpen(false); }} className={`${styles.menu} fixed inset-x-0 top-0 bottom-auto m-0 max-h-dvh w-full max-w-none overflow-y-auto border-0 bg-brand-50 px-5 pt-2 pb-20 text-brand-700 shadow-xl backdrop:bg-brand-950/25`}>
          <span aria-hidden="true" className={styles.ornament} />
          <div className="flex items-center justify-between gap-4">
            <MenuLanguages compact />
            <button ref={closeRef} type="button" aria-label="Закрыть меню" onClick={() => setOpen(false)} className="flex size-9 shrink-0 items-center justify-center rounded-xl text-neutral-600 hover:bg-brand-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-500">
              <MobileMenuCloseIcon />
            </button>
          </div>
          <nav aria-label="Разделы администратора" className="mt-2 flex flex-col items-center gap-1 border-t border-brand-100 pt-10">
            {[["applications", "/admin", "Заявки"], ["mail", "/admin/mail", "Почта"], ["clients", "/admin/clients", "Наши клиенты"], ["calendar", "/admin/calendar", "Календарь"]].map(([key, href, label]) => (
              <Link key={href} href={href} onClick={() => setOpen(false)} aria-current={active === key ? "page" : undefined} className={`px-4 py-3 text-center font-['Times_New_Roman',Times,serif] text-2xl transition-colors ${active === key ? "text-brand-950" : "text-brand-500 hover:text-brand-950"}`}>{label}</Link>
            ))}
          </nav>
          {logout && (
            <form action="/admin/logout" method="post" className="mt-4 flex justify-center">
              <button className="px-4 py-3 font-['Times_New_Roman',Times,serif] text-2xl text-red-700 transition-colors hover:text-red-800">Выйти на сайт</button>
            </form>
          )}
        </dialog>, document.body,
      )}
    </div>
  );
}
