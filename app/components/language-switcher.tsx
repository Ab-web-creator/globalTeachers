"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { SubjectPickerChevronIcon } from "@/app/components/svg";
import { useLanguage } from "@/lib/i18n/use-language";
import { useTranslations } from "@/lib/i18n/use-translations";
import type { Language } from "@/lib/i18n/languages";

const options: { code: Language; label: string; name: string }[] = [
  { code: "ru", label: "RUS", name: "Русский" },
  { code: "uz", label: "UZB", name: "Özbekça" },
  { code: "uz-Cyrl", label: "ЎЗБ", name: "Ўзбекча" },
];

export default function LanguageSwitcher() {
  const { language, selectLanguage } = useLanguage();
  const t = useTranslations();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [alignLeft, setAlignLeft] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const selectedIndex = options.findIndex(option => option.code === language);
  const selected = options[selectedIndex];

  function close(restoreFocus = false) {
    setOpen(false);
    if (restoreFocus) trigger.current?.focus();
  }

  function openMenu() {
    setAlignLeft((root.current?.getBoundingClientRect().left ?? 0) < 180);
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    buttons.current[selectedIndex]?.focus();
    function outside(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open, selectedIndex]);

  function navigate(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      close(true);
      return;
    }
    const current = buttons.current.indexOf(document.activeElement as HTMLButtonElement);
    let next: number;
    if (event.key === "ArrowDown") next = (current + 1) % options.length;
    else if (event.key === "ArrowUp") next = (current - 1 + options.length) % options.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = options.length - 1;
    else return;
    event.preventDefault();
    buttons.current[next]?.focus();
  }

  return (
    <div ref={root} className="relative shrink-0" onBlur={event => {
      if (!event.currentTarget.contains(event.relatedTarget)) close();
    }}>
      <button
        ref={trigger}
        type="button"
        aria-label={`${t("home.menuLanguages.message0440")}: ${selected.name}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => open ? close() : openMenu()}
        onKeyDown={event => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            openMenu();
          }
        }}
        className="flex min-h-7 items-center gap-2 rounded-md border border-neutral-300 bg-white/75 pl-3 pr-1.5 text-xs font-semibold text-neutral-700 hover:bg-white/90 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-500"
      >
        <span>{selected.label}</span>
        <SubjectPickerChevronIcon className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div
          id={id}
          role="menu"
          aria-label={t("home.menuLanguages.message0440")}
          onKeyDown={navigate}
          className={`absolute top-full z-50 mt-2 min-w-44 rounded-md border border-neutral-200 bg-white p-1 text-sm text-neutral-700 shadow-lg ${alignLeft ? "left-0" : "right-0"}`}
        >
          {options.map((option, index) => (
            <button
              key={option.code}
              ref={element => { buttons.current[index] = element; }}
              type="button"
              role="menuitemradio"
              tabIndex={-1}
              aria-checked={language === option.code}
              onClick={() => {
                close(true);
                if (language === option.code) return;
                selectLanguage(option.code);
                router.refresh();
              }}
              className={`flex min-h-11 w-full items-center gap-3 rounded-sm px-3 py-2 text-left hover:bg-brand-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-500 ${language === option.code ? "bg-brand-50 font-semibold text-brand-600" : ""}`}
            >
              <span className="w-8 shrink-0 text-xs font-semibold">{option.label}</span>
              <span lang={option.code}>{option.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
