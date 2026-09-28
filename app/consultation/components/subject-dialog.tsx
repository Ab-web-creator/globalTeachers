import { useEffect, useRef, useState } from "react";
import SubjectOptions from "./subject-options";
import { subjects } from "./subjects";

type Props = {
  selected: string[];
  onSelect: (subject: string) => void;
  onClose: () => void;
};

export default function SubjectDialog({ selected, onSelect, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLocaleLowerCase("ru");
  const options = subjects.filter((subject) => subject.toLocaleLowerCase("ru").includes(normalized));

  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);

  return (
    <dialog ref={dialog} aria-labelledby="subject-dialog-title" aria-describedby="subject-dialog-help" onClose={(event) => { if (!event.currentTarget.open) onClose(); }} className="fixed inset-0 m-auto h-[90dvh] max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl overflow-hidden rounded-3xl bg-white p-0 shadow-2xl backdrop:bg-brand-950/50">
      <div className="flex h-full min-h-0 flex-col">
        <header className="shrink-0 border-b border-brand-100 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 id="subject-dialog-title" className="text-xl font-semibold text-brand-700">Выберите предметы</h2>
            <button type="button" onClick={() => dialog.current?.close()} aria-label="Закрыть выбор предметов" className="flex size-10 shrink-0 items-center justify-center rounded-full text-brand-600 hover:bg-brand-50 focus-visible:-outline-offset-2">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5"><path d="m6 6 12 12M18 6 6 18" /></svg>
            </button>
          </div>
          <p id="subject-dialog-help" className="mt-2 text-sm text-neutral-500">Можно выбрать несколько предметов.</p>
          <label htmlFor="subject-search" className="sr-only">Поиск по предметам</label>
          <input id="subject-search" type="search" value={query} onChange={(event) => { setQuery(event.target.value); list.current?.scrollTo({ top: 0 }); }} placeholder="Поиск по предметам" autoComplete="off" className="mt-4 w-full rounded-xl border border-brand-200 px-4 py-3 text-base text-brand-700 focus:border-brand-500 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-500" />
        </header>
        <div ref={list} className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 sm:p-4">
          <SubjectOptions options={options} selected={selected} onSelect={onSelect} />
          {options.length === 0 && <p role="status" className="p-4 text-sm text-neutral-500">Нет совпадений. Попробуйте другой запрос.</p>}
        </div>
        <footer className="flex shrink-0 items-center justify-between gap-4 border-t border-brand-100 p-5 sm:p-6">
          <span className="text-sm text-neutral-500" aria-live="polite">Выбрано: {selected.length}</span>
          <button type="button" onClick={() => dialog.current?.close()} className="rounded-xl bg-brand-500 px-8 py-3 font-medium text-white hover:bg-brand-600 focus-visible:-outline-offset-2">Готово ✓</button>
        </footer>
      </div>
    </dialog>
  );
}
