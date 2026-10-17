"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ApplicationCalendarIcon, CandidateGroupIcon, CardChevronIcon, ClientCheckIcon, EnvelopeIcon, MenuToggleIcon, MobileMenuCloseIcon } from "@/app/components/svg";
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
    const alignCloseButton = () => {
      const button = closeRef.current;
      if (!trigger || !button) return;
      const bounds = trigger.getBoundingClientRect();
      Object.assign(button.style, {
        position: "fixed", top: `${bounds.top}px`, left: `${bounds.left}px`,
        width: `${bounds.width}px`, height: `${bounds.height}px`,
      });
    };
    alignCloseButton();
    window.addEventListener("resize", alignCloseButton);
    const desktop = window.matchMedia("(min-width: 640px)");
    const onResize = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener("change", onResize);
    return () => {
      window.removeEventListener("resize", alignCloseButton);
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      desktop.removeEventListener("change", onResize);
      trigger?.focus({ preventScroll: true });
    };
  }, [open]);
  return (
    <div className="sm:hidden">
      <button ref={triggerRef} type="button" aria-label={open ? "Закрыть меню" : "Открыть меню"} aria-expanded={open} aria-controls="admin-mobile-navigation" onClick={() => setOpen(!open)} className={`flex size-10 items-center justify-center rounded-xl text-neutral-600 hover:bg-brand-50 ${open ? "invisible" : ""}`}>
        <MenuToggleIcon open={open} />
      </button>
      {open && createPortal(
        <dialog ref={dialogRef} id="admin-mobile-navigation" aria-label="Меню администратора" onClick={event => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
            setOpen(false);
          }
        }} onCancel={event => { event.preventDefault(); setOpen(false); }} className="fixed inset-x-0 top-0 bottom-auto m-0 max-h-[85dvh] w-full max-w-none overflow-y-auto border-0 bg-neutral-900/10 p-4 pb-12 text-neutral-800 backdrop-blur-xs backdrop:bg-transparent">
          <div className="mx-auto flex w-full max-w-lg flex-col">
            <div className="flex items-center justify-between gap-4">
              <div className="-translate-y-1"><MenuLanguages pill /></div>
              <button ref={closeRef} type="button" aria-label="Закрыть меню" onClick={() => setOpen(false)} className="z-10 flex size-11 shrink-0 items-center justify-center rounded-full bg-transparent text-white focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white">
                <MobileMenuCloseIcon highContrast />
              </button>
            </div>
            <nav aria-label="Разделы администратора" className="mt-10 flex flex-col gap-3 pb-2">
              {[
                { key: "applications", href: "/admin", label: "Заявки", Icon: CandidateGroupIcon },
                { key: "mail", href: "/admin/mail", label: "Почта", Icon: EnvelopeIcon },
                { key: "clients", href: "/admin/clients", label: "Наши клиенты", Icon: ClientCheckIcon },
                { key: "calendar", href: "/admin/calendar", label: "Календарь", Icon: ApplicationCalendarIcon },
              ].map(({ key, href, label, Icon }) => (
                <Link key={href} href={href} onClick={() => setOpen(false)} aria-current={active === key ? "page" : undefined} className={`flex min-h-16 items-center gap-3 rounded-2xl bg-white px-4 py-2 text-base font-medium shadow-lg transition-colors hover:bg-neutral-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-500 ${active === key ? "text-brand-600" : "text-neutral-800"}`}>
                  <span className={`flex size-10 shrink-0 items-center justify-center rounded-full ${active === key ? "bg-brand-50 text-brand-600" : "bg-neutral-100 text-neutral-700"}`}><Icon className="size-6" /></span>
                  <span className="min-w-0 flex-1">{label}</span>
                  <CardChevronIcon className="size-4 shrink-0 text-neutral-500" />
                </Link>
              ))}
              {logout && (
                <form action="/admin/logout" method="post" className="mt-2">
                  <button className="flex min-h-16 w-full items-center justify-center rounded-2xl bg-blue-900 px-4 py-4 text-center text-lg font-semibold text-white shadow-lg transition-colors hover:bg-blue-950 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-300">Выйти на сайт</button>
                </form>
              )}
            </nav>
          </div>
        </dialog>, document.body,
      )}
    </div>
  );
}
