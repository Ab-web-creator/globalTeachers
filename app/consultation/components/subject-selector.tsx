import { SubjectPickerChevronIcon } from "@/app/components/svg";
import { useEffect, useRef, useState } from "react";
import RequiredMark from "./required-mark";
import SelectedSubjectList from "./selected-subject-list";
import SubjectDropdown from "./subject-dropdown";
import SubjectPicker from "./subject-picker";
import SubjectSearchField from "./subject-search-field";
import { MAX_SUBJECTS } from "./subjects";
import { getSubjectNotice, subjectNotices, type SubjectNoticeKind } from "./subject-notices";

export default function SubjectSelector({ value, onChange }: { value: string; onChange: (value: string) => void; }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const trigger = useRef<HTMLButtonElement>(null);
  const anchor = useRef<HTMLDivElement>(null);
  const selected = value ? value.split("; ") : [];
  const [noticeKind, setNoticeKind] = useState<SubjectNoticeKind | null>(null);
  const noticeDialog = useRef<HTMLDialogElement>(null);
  const notice = noticeKind ? subjectNotices[noticeKind] : null;

  useEffect(() => {
    if (noticeKind && !noticeDialog.current?.open) noticeDialog.current?.showModal();
  }, [noticeKind]);

  function finishSelection() {
    const kind = getSubjectNotice(selected);
    setOpen(false);
    setQuery("");
    if (kind) {
      setNoticeKind(kind);
      // Open in the Done click itself; the dialog content updates in the same render.
      if (!noticeDialog.current?.open) noticeDialog.current?.showModal();
    } else {
      trigger.current?.focus({ preventScroll: true });
    }
  }

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
      {open && <SubjectDropdown anchor={anchor}><SubjectPicker query={query} selected={selected} onSelect={select} onDone={finishSelection} /></SubjectDropdown>}
      <dialog ref={noticeDialog} onClose={() => { setNoticeKind(null); trigger.current?.focus({ preventScroll: true }); }} aria-labelledby="subject-notice-title" className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-3xl bg-white p-6 text-brand-700 shadow-xl backdrop:bg-brand-950/50 sm:p-8">
        {notice && <>
          <h3 id="subject-notice-title" className="text-xl font-semibold">{notice.title}</h3>
          <p className="mt-7 text-base leading-relaxed">{notice.reason}</p>
          <p className="mt-4 text-base font-semibold leading-relaxed">{notice.exclusion}</p>
          {notice.recommendStart && <p className="mt-4 text-base leading-relaxed">Однако программа <strong>START</strong> поможет вам оценить свои возможности и рассмотреть альтернативные пути международной карьеры.</p>}
          <button type="button" onClick={() => noticeDialog.current?.close()} className="mt-6 rounded-xl bg-brand-500 px-5 py-3 font-medium text-white hover:bg-brand-600">Продолжить заполнение</button>
        </>}
      </dialog>
    </fieldset>
  );
}
