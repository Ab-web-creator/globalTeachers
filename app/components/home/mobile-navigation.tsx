"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import { BriefcaseIcon, CandidateGroupIcon, CardChevronIcon, MenuHomeIcon, MenuPricingIcon, MobileMenuCloseIcon } from "@/app/components/svg";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import MenuLanguages from "./menu-languages";
import { navigationItems } from "./navigation-items";

type MobileNavigationProps = { onClose: () => void; };

export default function MobileNavigation({ onClose }: MobileNavigationProps) {
  const t = useTranslations();
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    const alignCloseButton = () => {
      const trigger = document.querySelector<HTMLButtonElement>('button[aria-controls="mobile-menu"]');
      const button = closeButton.current;
      if (!trigger || !button) return;
      const bounds = trigger.getBoundingClientRect();
      Object.assign(button.style, {
        position: "fixed",
        top: `${bounds.top}px`,
        left: `${bounds.left}px`,
        width: `${bounds.width}px`,
        height: `${bounds.height}px`,
      });
    };
    alignCloseButton();
    window.addEventListener("resize", alignCloseButton);
    const desktop = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = () => { if (desktop.matches) onClose(); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      desktop.removeEventListener("change", closeOnDesktop);
      window.removeEventListener("resize", alignCloseButton);
      document.body.style.overflow = previousOverflow;
      element?.close();
    };
  }, [onClose]);

  return createPortal(
    <dialog
      ref={dialog}
      id="mobile-menu"
      aria-label={t("home.mobileNavigation.message0442")}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
      }}
      className="fixed inset-x-0 top-0 bottom-auto m-0 max-h-[85dvh] w-full max-w-none overflow-y-auto border-0 bg-neutral-900/10 p-4 pb-12 text-neutral-800 backdrop-blur-xs backdrop:bg-transparent sm:p-6 sm:pb-12"
    >
      <div className="mx-auto flex w-full max-w-lg flex-col">
        <div className="flex items-center justify-between gap-4">
          <div className="-translate-y-1"><MenuLanguages pill interactive /></div>
          <button ref={closeButton} type="button" onClick={onClose} aria-label={t("home.mobileNavigation.message0443")} autoFocus className="z-10 flex size-11 shrink-0 items-center justify-center rounded-full bg-transparent text-white focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white">
            <MobileMenuCloseIcon highContrast />
          </button>
        </div>
        <nav aria-label={t("home.mobileNavigation.message0444")} className="mt-10 flex flex-col gap-3 pb-2">
          {[{ label: "Главная страница", href: "/#home", Icon: MenuHomeIcon }, ...navigationItems.map((item, index) => ({ ...item, Icon: [CandidateGroupIcon, BriefcaseIcon, MenuPricingIcon][index] }))].map(({ label, href, Icon }) => (
            <Link key={href} href={href} onClick={onClose} className="flex min-h-16 items-center gap-3 rounded-2xl bg-white px-4 py-2 text-base font-medium shadow-lg transition-colors hover:bg-neutral-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-500 sm:gap-4 sm:text-lg">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-700"><Icon className="size-6" /></span>
              <span className="min-w-0 flex-1">{t.content(label)}</span>
              <CardChevronIcon className="size-4 shrink-0 text-neutral-500" />
            </Link>
          ))}
          <Link href="/consultation" onClick={onClose} className="mt-2 flex min-h-16 items-center justify-center rounded-2xl border border-white bg-blue-900 px-4 py-4 text-center text-lg font-semibold text-white transition-colors hover:bg-blue-950 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-300">{t("home.mobileNavigation.message0446")}</Link>
        </nav>
      </div>
    </dialog>, document.body,
  );
}
