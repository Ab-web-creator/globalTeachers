import { SubjectTagRemoveIcon } from "@/app/components/svg";

type Props = {
  selected: string[];
  onRemove: (subject: string) => void;
};

export default function SelectedSubjects({ selected, onRemove }: Props) {
  if (!selected.length) return null;

  return (
    <div role="group" aria-label="Выбранные предметы" className="contents">
      {selected.map((subject) => (
        <span key={subject} className="flex min-w-0 max-w-full items-center gap-1 rounded-md bg-brand-100 pl-3 text-sm text-brand-700">
          <span title={subject} className="min-w-0 truncate">{subject}</span>
          <button type="button" aria-label={`Убрать ${subject}`} onClick={() => onRemove(subject)} className="flex size-8 shrink-0 items-center justify-center rounded-md hover:bg-brand-200 focus-visible:-outline-offset-2">
            <SubjectTagRemoveIcon />
          </button>
        </span>
      ))}
    </div>
  );
}
