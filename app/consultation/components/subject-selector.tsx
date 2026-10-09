import { SubjectPickerChevronIcon } from "@/app/components/svg";
import { useRef, useState } from "react";
import RequiredMark from "./required-mark";
import SelectedSubjectList from "./selected-subject-list";
import SubjectDropdown from "./subject-dropdown";
import SubjectPicker from "./subject-picker";
import SubjectSearchField from "./subject-search-field";
import { MAX_SUBJECTS } from "./subjects";

export default function SubjectSelector({ value, onChange }: { value: string; onChange: (value: string) => void; }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const trigger = useRef<HTMLButtonElement>(null);
  const anchor = useRef<HTMLDivElement>(null);
  const selected = value ? value.split("; ") : [];

  function toggleOpen() {
    setOpen(!open);
    setQuery("");
    trigger.current?.focus({ preventScroll: true });
  }

  function select(subject: string) {
    if (!selected.includes(subject) && selected.length >= MAX_SUBJECTS) return;
    const next = selected.includes(subject) ? selected.filter((item) => item !== subject) : [...selected, subject];
    onChange(next.join("; "));
  }

  return (
    <fieldset className="min-w-0" onKeyDown={(event) => { if (open && event.key === "Escape") { event.preventDefault(); event.stopPropagation(); toggleOpen(); } }}>
      <legend id="subject-label" className="text-sm font-medium">Что вы преподаёте?<RequiredMark /></legend>
      <div ref={anchor} className={`relative mt-3 min-h-12 min-w-0 ${open ? "" : "rounded-xl border border-brand-200 bg-white hover:border-brand-400"}`}>
        <button ref={trigger} type="button" onClick={toggleOpen} aria-label={open ? "Закрыть выбор предметов" : selected.length ? `Изменить предметы: ${selected.join("; ")}` : "Выберите предметы"} aria-controls={open ? "subject-picker" : undefined} aria-expanded={open} aria-describedby="subject-label step-description" className={`${open ? "absolute right-1 top-1 z-10 size-12" : "absolute inset-0 flex w-full items-center justify-between gap-3 px-4 py-3"} rounded-xl text-left text-base text-brand-700 focus-visible:-outline-offset-2`}>
          {!open && <span>{selected.length ? null : "Выберите предметы"}</span>}
          <SubjectPickerChevronIcon className={`absolute size-5 shrink-0 text-brand-600 ${open ? "right-3 top-3 rotate-180" : "right-4 top-4"}`} />
        </button>
        {open ? (
          <SubjectSearchField query={query} selected={selected} onQueryChange={setQuery} onRemove={select} />
        ) : (
          <SelectedSubjectList selected={selected} onRemove={(subject) => { select(subject); trigger.current?.focus({ preventScroll: true }); }} />
        )}
      </div>
      {open && <SubjectDropdown anchor={anchor}><SubjectPicker query={query} selected={selected} onSelect={select} onDone={toggleOpen} /></SubjectDropdown>}
    </fieldset>
  );
}
