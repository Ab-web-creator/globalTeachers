import { subjects } from "../../consultation/components/subjects";

export default function ApplicationSubjectChoices({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const selected = value ? value.split("; ") : [];
  return (
    <fieldset className="min-w-0 sm:col-span-2">
      <legend className="text-sm font-medium">Специализация</legend>
      <p className="mt-1 text-xs text-neutral-500">Можно выбрать несколько предметов.</p>
      <div className="mt-2 max-h-56 space-y-2 overflow-y-auto rounded-xl border border-brand-200 p-3">
        {subjects.map((subject) => (
          <label key={subject} className="flex cursor-pointer items-start gap-2 text-sm">
            <input type="checkbox" checked={selected.includes(subject)} onChange={() => onChange((selected.includes(subject) ? selected.filter((item) => item !== subject) : [...selected, subject]).join("; "))} className="mt-0.5 size-4 shrink-0 accent-brand-500" />
            <span>{subject}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
