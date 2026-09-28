type Props = {
  options: string[];
  selected: string[];
  onSelect: (subject: string) => void;
};

export default function SubjectOptions({ options, selected, onSelect }: Props) {
  return (
    <ul aria-label="Предметы">
      {options.map((subject) => (
        <li key={subject}>
          <label className={`flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2 text-sm leading-relaxed hover:bg-brand-50 ${selected.includes(subject) ? "bg-brand-50 text-brand-600" : "text-brand-700"}`}>
            <input type="checkbox" checked={selected.includes(subject)} onChange={() => onSelect(subject)} className="mt-1 size-5 shrink-0 accent-brand-500" />
            <span>{subject}</span>
          </label>
        </li>
      ))}
    </ul>
  );
}
