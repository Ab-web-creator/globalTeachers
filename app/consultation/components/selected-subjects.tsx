type Props = {
  selected: string[];
  onRemove: (subject: string) => void;
};

export default function SelectedSubjects({ selected, onRemove }: Props) {
  if (!selected.length) return null;

  return (
    <ul aria-label="Выбранные предметы" className="max-h-48 space-y-2 overflow-y-auto overscroll-contain px-2 pb-2">
      {selected.map((subject) => (
        <li key={subject} className="flex min-w-0 items-center gap-2 rounded-lg bg-brand-50 py-1 pl-3 pr-1 text-sm text-brand-600">
          <span title={subject} className="min-w-0 flex-1 truncate">{subject}</span>
          <button type="button" aria-label={`Убрать ${subject}`} onClick={() => onRemove(subject)} className="flex size-8 shrink-0 items-center justify-center rounded-md hover:bg-brand-100 focus-visible:-outline-offset-2">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="size-4"><path d="m6 6 12 12M18 6 6 18" /></svg>
          </button>
        </li>
      ))}
    </ul>
  );
}
