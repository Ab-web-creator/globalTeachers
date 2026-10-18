"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import { SubjectPickerChevronIcon } from "@/app/components/svg";
import { useRef, useState } from "react";
import RequiredMark from "./required-mark";
import SelectedSubjectList from "./selected-subject-list";
import SubjectDropdown from "./subject-dropdown";
import SubjectPicker from "./subject-picker";
import SubjectSearchField from "./subject-search-field";
import { MAX_SUBJECTS, subjects } from "./subjects";

export default function SubjectSelector({ value, onChange, availableSubjects = subjects, error, label = "Что вы преподаёте?", id, placeholderClassName = "text-neutral-400" }: { id?: string; label?: string; placeholderClassName?: string; error?: string; value: string; onChange: (value: string) => void; availableSubjects?: readonly string[]; }) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const trigger = useRef<HTMLButtonElement>(null);
  const anchor = useRef<HTMLDivElement>(null);
  const selected = value ? value.split("; ") : [];
  function finishSelection() {
    setOpen(false);
    setQuery("");
    trigger.current?.focus({ preventScroll: true });
  }

  function toggleOpen() {
    setOpen(!open);
    setQuery("");
    trigger.current?.focus({ preventScroll: true });
  }

  function select(subject: string) {
    if (!availableSubjects.includes(subject)) return;
    if (!selected.includes(subject) && selected.length >= MAX_SUBJECTS) return;
    const next = selected.includes(subject) ? selected.filter((item) => item !== subject) : [...selected, subject];
    onChange(next.join("; "));
    if (!selected.includes(subject)) setQuery("");
  }

  return (
    <fieldset className="min-w-0" onKeyDown={(event) => { if (open && event.key === "Escape") { event.preventDefault(); event.stopPropagation(); toggleOpen(); } }}>
      <legend id="subject-label" className="text-sm font-medium">{t.content(label)}<RequiredMark /></legend>
      <div ref={anchor} className={`relative mt-2 min-h-12.5 min-w-0 sm:h-12.5 ${open ? "" : `rounded-xl border ${error ? "border-red-500" : "border-brand-200 hover:border-brand-400"} bg-white`}`}>
        <button id={id} ref={trigger} type="button" onClick={toggleOpen} aria-label={t.content(open ? "Закрыть выбор предметов" : selected.length ? `Изменить предметы: ${selected.map(subject => t.content(subject)).join("; ")}` : "Выберите предметы")} aria-controls={open ? "subject-picker" : undefined} aria-expanded={open} aria-describedby={error ? "subject-label subject-error" : "subject-label step-description"} className={`${open ? "absolute right-1 top-1/2 z-10 size-10 -translate-y-1/2" : "absolute inset-0 flex w-full items-center justify-between gap-3 px-4 py-3"} rounded-xl text-left text-base text-brand-700 focus-visible:-outline-offset-2`}>
          {!open && <span className={placeholderClassName}>{t.content(selected.length ? null : "Выберите предметы")}</span>}
          <SubjectPickerChevronIcon className={`absolute size-5 shrink-0 text-brand-600 ${open ? "right-2.5 top-2.5 rotate-180" : "right-4 top-1/2 -translate-y-1/2"}`} />
        </button>
        {open ? (
          <SubjectSearchField query={query} selected={selected} onQueryChange={setQuery} onRemove={select} />
        ) : (
          <SelectedSubjectList selected={selected} onRemove={(subject) => { select(subject); trigger.current?.focus({ preventScroll: true }); }} />
        )}
      </div>
      {t.content(error && <p id="subject-error" className="mt-2 text-sm text-red-700">{t.content(error)}</p>)}
      {open && <SubjectDropdown anchor={anchor}><SubjectPicker availableSubjects={availableSubjects} query={query} selected={selected} onSelect={select} onDone={finishSelection} /></SubjectDropdown>}
    </fieldset>
  );
}
