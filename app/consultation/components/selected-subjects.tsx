type Props = {
  selected: string[];
  onRemove: (subject: string) => void;
};

export default function SelectedSubjects({ selected, onRemove }: Props) {
  if (!selected.length) return null;
  const subject = selected[selected.length - 1];

  return (
    <div role="group" aria-label={`Выбранные предметы: ${selected.join("; ")}`} className="flex min-w-0 items-center gap-2 px-2 pb-2">
      <span title={selected.join("\n")} aria-label={`Выбрано предметов: ${selected.length}`} className="flex shrink-0 items-center gap-0.5">
        {selected.length > 1 && <span aria-hidden="true" className="h-8 w-1 rounded-l-md bg-brand-200" />}
        {selected.length > 2 && <span aria-hidden="true" className="h-8 w-1 rounded-l-md bg-brand-200" />}
        <span className="flex h-8 min-w-8 items-center justify-center rounded-md bg-brand-100 px-2 text-sm font-medium text-brand-700">{selected.length}</span>
      </span>
      <span className="flex min-w-0 items-center gap-1 rounded-md bg-brand-100 pl-3 text-sm text-brand-700">
        <span title={subject} className="min-w-0 truncate">{subject}</span>
        <button type="button" aria-label={`Убрать ${subject}`} onClick={() => onRemove(subject)} className="flex size-8 shrink-0 items-center justify-center rounded-md hover:bg-brand-200 focus-visible:-outline-offset-2">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="size-4"><path d="m6 6 12 12M18 6 6 18" /></svg>
        </button>
      </span>
    </div>
  );
}
