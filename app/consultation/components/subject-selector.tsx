import { useEffect, useRef, useState } from "react";

const subjects = ["Начальные классы", "Математика", "Английский язык", "Физика", "Химия", "Биология", "Музыка", "Искусство", "Физкультура", "Другое"];

export default function SubjectSelector({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [query, setQuery] = useState("");
  const search = useRef<HTMLInputElement>(null);
  const selected = value ? value.split("; ") : [];
  const filtered = subjects.filter((subject) => subject.toLocaleLowerCase("ru").includes(query.trim().toLocaleLowerCase("ru")));
  useEffect(() => {
    search.current?.setCustomValidity(value ? "" : "Выберите хотя бы один предмет.");
  }, [value]);
  function toggle(subject: string) {
    const next = selected.includes(subject) ? selected.filter((item) => item !== subject) : [...selected, subject];
    onChange(next.join("; "));
  }
  return (
    <fieldset>
      <legend className="text-sm font-medium">Что вы преподаёте?</legend>
      <p id="subjects-help" className="mt-1 text-xs text-neutral-500">Можно выбрать несколько вариантов.</p>
      <label htmlFor="subject-search" className="sr-only">Поиск по предметам</label>
      <input ref={search} id="subject-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск по предметам" aria-describedby="subjects-help" className="mt-3 w-full rounded-xl border border-brand-200 px-4 py-3 text-base focus:outline-2 focus:outline-brand-500" />
      {selected.length > 0 && <div className="mt-3 flex flex-wrap gap-2" aria-label="Выбранные предметы">
        {selected.map((subject) => <button key={subject} type="button" onClick={() => toggle(subject)} aria-label={`Убрать ${subject}`} className="rounded-lg bg-brand-50 px-3 py-1.5 text-xs text-brand-600">{subject} <span aria-hidden="true">×</span></button>)}
      </div>}
      <div className="mt-3 grid max-h-40 grid-cols-2 gap-2 overflow-y-auto rounded-xl border border-brand-100 p-3">
        {filtered.map((subject) => <label key={subject} className="flex items-start gap-2 text-sm"><input type="checkbox" checked={selected.includes(subject)} onChange={() => toggle(subject)} className="mt-0.5 size-4 shrink-0 accent-brand-500" />{subject}</label>)}
        {filtered.length === 0 && <p className="col-span-2 text-sm text-neutral-500">Нет совпадений. <button type="button" className="text-brand-600 underline" onClick={() => { if (!selected.includes("Другое")) toggle("Другое"); setQuery(""); }}>Выбрать «Другое»</button></p>}
      </div>
    </fieldset>
  );
}
