import { useState } from "react";
import { createPortal } from "react-dom";
import RequiredMark from "./required-mark";
import SubjectDialog from "./subject-dialog";

export default function SubjectSelector({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const selected = value ? value.split("; ") : [];

  function select(subject: string) {
    const next = selected.includes(subject) ? selected.filter((item) => item !== subject) : [...selected, subject];
    onChange(next.join("; "));
  }

  return (
    <fieldset>
      <legend id="subject-label" className="text-sm font-medium">Что вы преподаёте?<RequiredMark /></legend>
      <button type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open} aria-describedby="subject-label step-description" className="mt-3 flex w-full items-center justify-between gap-3 rounded-xl border border-brand-200 bg-white px-4 py-3 text-left text-base text-brand-700 hover:border-brand-400 focus-visible:-outline-offset-2">
        <span>{selected.length ? `Выбрано предметов: ${selected.length}` : "Выберите предметы"}</span>
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-5 shrink-0 text-brand-600"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      {selected.length > 0 && <div className="mt-3 flex flex-wrap gap-2" aria-label="Выбранные предметы">
        {selected.map((subject) => <button key={subject} type="button" onClick={() => select(subject)} aria-label={`Убрать ${subject}`} className="rounded-lg bg-brand-50 px-3 py-1.5 text-xs text-brand-600">{subject} <span aria-hidden="true">×</span></button>)}
      </div>}
      {open && createPortal(<SubjectDialog selected={selected} onSelect={select} onClose={() => setOpen(false)} />, document.body)}
    </fieldset>
  );
}
