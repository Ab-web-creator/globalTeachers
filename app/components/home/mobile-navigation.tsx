import { useEffect, useRef } from "react";
import type { PanelProps } from "./content";
import MenuLanguages from "./menu-languages";
import { navigationItems } from "./navigation-items";

type MobileNavigationProps = PanelProps & { onClose: () => void };

export default function MobileNavigation({ openPanel, onClose }: MobileNavigationProps) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    const desktop = window.matchMedia("(min-width: 1280px)");
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
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-3 text-brand-700 backdrop:bg-brand-950/60 backdrop:backdrop-blur-sm sm:p-6"
    >
      <div className="ml-auto flex max-h-full w-full max-w-sm flex-col overflow-y-auto rounded-3xl bg-white shadow-2xl sm:max-w-md">
        <div className="flex items-center justify-between gap-4 px-5 pt-5 sm:px-7 sm:pt-7">
          <MenuLanguages />
          <button type="button" onClick={onClose} aria-label="Закрыть меню" autoFocus className="flex size-11 items-center justify-center rounded-full text-brand-500 transition hover:bg-brand-50">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-6" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" /></svg>
          </button>
        </div>
        <div aria-hidden="true" className="mx-7 my-6 flex items-center gap-4 text-brand-300">
          <span className="h-px flex-1 bg-brand-100" />
          <span className="size-2 rotate-45 bg-brand-400" />
          <span className="h-px flex-1 bg-brand-100" />
        </div>
        <nav aria-label="Мобильная навигация" className="flex flex-col items-stretch gap-2 px-5 pb-8 text-center text-xl font-medium sm:px-7">
          <a href="#home" onClick={onClose} aria-current="page" className="rounded-xl bg-brand-50 px-4 py-3 text-brand-500">Главная</a>
          {navigationItems.map(({ label, panel }) => (
            <button key={panel} type="button" onClick={() => openPanel(panel)} className="rounded-xl px-4 py-3 transition hover:bg-brand-50 hover:text-brand-500">{label}</button>
          ))}
          <a href="#programs" onClick={onClose} className="rounded-xl px-4 py-3 transition hover:bg-brand-50 hover:text-brand-500">Программы</a>
          <button type="button" onClick={() => openPanel("Consultation")} className="mt-4 rounded-full bg-brand-500 px-6 py-4 text-base text-white transition hover:bg-brand-600">Получить консультацию</button>
        </nav>
      </div>
    </dialog>
  );
}
