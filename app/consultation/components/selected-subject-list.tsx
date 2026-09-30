type Props = {
  selected: string[];
  onRemove: (subject: string) => void;
};

export default function SelectedSubjectList({ selected, onRemove }: Props) {
  if (!selected.length) return null;

  return (
    <ul aria-label="Выбранные предметы" className="pointer-events-none relative flex min-w-0 flex-wrap gap-2 p-2 pr-14">
      {selected.map((subject) => (
        <li key={subject} className="flex min-w-0 max-w-full items-center gap-2 rounded-lg bg-brand-50 py-1 pl-3 pr-1 text-sm text-brand-600">
          <span className="min-w-0 flex-1 break-words">{subject}</span>
          <button type="button" aria-label={`Убрать ${subject}`} onClick={() => onRemove(subject)} className="pointer-events-auto flex size-8 shrink-0 items-center justify-center rounded-md hover:bg-brand-100 focus-visible:-outline-offset-2">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="size-4"><path d="m6 6 12 12M18 6 6 18" /></svg>
          </button>
        </li>
      ))}
    </ul>
  );
}
