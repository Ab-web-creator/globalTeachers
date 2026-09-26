import Link from "next/link";
import { useEffect, useRef } from "react";
import MenuLanguages from "./menu-languages";
import { navigationItems } from "./navigation-items";
import styles from "./site-header.module.css";

type MobileNavigationProps = { onClose: () => void };

export default function MobileNavigation({ onClose }: MobileNavigationProps) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    const desktop = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = () => { if (desktop.matches) onClose(); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      desktop.removeEventListener("change", closeOnDesktop);
      document.body.style.overflow = previousOverflow;
      element?.close();
    };
  }, [onClose]);

  return (
    <dialog
      ref={dialog}
      id="mobile-menu"
      aria-label="Меню сайта"
      onCancel={onClose}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
      className={`${styles.menuColors} fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-3 text-brand-700 backdrop:bg-violet-600/25 backdrop:backdrop-blur-sm sm:p-6`}
    >
      <div className="ml-auto flex max-h-full w-full max-w-sm flex-col overflow-y-auto rounded-3xl bg-white shadow-2xl shadow-violet-500/20 sm:max-w-md">
        <div className="flex items-center justify-between gap-4 px-5 pt-5 sm:px-7 sm:pt-7">
          <MenuLanguages />
          <button type="button" onClick={onClose} aria-label="Закрыть меню" autoFocus className="flex size-11 items-center justify-center rounded-2xl sm:rounded-full text-brand-500 transition hover:bg-brand-50">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-6" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" /></svg>
          </button>
        </div>
        <div aria-hidden="true" className="mx-7 my-6 flex items-center gap-4 text-brand-300">
          <span className="h-px flex-1 bg-brand-100" />
          <span className="size-2 rotate-45 bg-brand-400" />
          <span className="h-px flex-1 bg-brand-100" />
        </div>
        <nav aria-label="Мобильная навигация" className="flex flex-col items-stretch gap-2 px-5 pb-8 text-center text-xl font-medium sm:px-7">
          <Link href="/#home" onClick={onClose} className="rounded-xl bg-brand-50 px-4 py-3 text-brand-500">Главная</Link>
          {navigationItems.map(({ label, href }) => (
            <Link key={label} href={href} onClick={onClose} className="rounded-xl px-4 py-3 transition hover:bg-brand-50 hover:text-brand-500">{label}</Link>
          ))}
          <Link href="/#programs" onClick={onClose} className="rounded-xl px-4 py-3 transition hover:bg-brand-50 hover:text-brand-500">Программы</Link>
          <Link href="/consultation" onClick={onClose} className="mt-4 rounded-2xl sm:rounded-full action-gradient-outline px-6 py-2.5 sm:py-4 text-base transition">Получить консультацию</Link>
        </nav>
      </div>
    </dialog>
  );
}
