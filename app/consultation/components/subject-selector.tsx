import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import SubjectOptions from "./subject-options";
import { subjects } from "./subjects";

export default function SubjectSelector({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const search = useRef<HTMLInputElement>(null);
  const selected = value ? value.split("; ") : [];
  const normalized = query.trim().toLocaleLowerCase("ru");
  const filtered = subjects.filter((subject) => !selected.includes(subject) && subject.toLocaleLowerCase("ru").includes(normalized));
  const options = filtered.length ? filtered : selected.includes("Другое") ? [] : ["Другое"];
  const open = focused && normalized.length > 0;

  useEffect(() => {
    search.current?.setCustomValidity(value ? "" : "Выберите хотя бы один предмет.");
  }, [value]);

  function select(subject: string) {
    onChange([...selected, subject].join("; "));
    setQuery("");
    setActiveIndex(-1);
    search.current?.focus({ preventScroll: true });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setFocused(false);
      setActiveIndex(-1);
    } else if (open && options.length && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      event.preventDefault();
      setActiveIndex((index) => event.key === "ArrowDown" ? (index + 1) % options.length : (index <= 0 ? options.length : index) - 1);
    } else if (event.key === "Enter" && normalized) {
      event.preventDefault();
      if (open && activeIndex >= 0 && options[activeIndex]) select(options[activeIndex]);
    }
  }

  return (
    <fieldset>
      <legend className="text-sm font-medium">Что вы преподаёте?</legend>
      <p id="subjects-help" className="mt-1 text-xs text-neutral-500">Начните вводить предмет и выберите вариант. Можно выбрать несколько.</p>
      <div className="relative mt-3">
        <label htmlFor="subject-search" className="sr-only">Поиск по предметам</label>
        <input
          ref={search}
          id="subject-search"
          type="text"
          role="combobox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={open && options.length > 0}
          aria-controls={open && options.length > 0 ? "subject-options" : undefined}
          aria-activedescendant={open && activeIndex >= 0 ? `subject-option-${activeIndex}` : undefined}
          aria-describedby="subjects-help"
          value={query}
          onChange={(event) => { setQuery(event.target.value); setFocused(true); setActiveIndex(-1); }}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); setActiveIndex(-1); }}
          onKeyDown={handleKeyDown}
          placeholder="Поиск по предметам"
          className="w-full rounded-xl border border-brand-200 px-4 py-3 text-base focus:outline-2 focus:outline-brand-500"
        />
        {open && options.length > 0 && <SubjectOptions options={options} activeIndex={activeIndex} onSelect={select} />}
      </div>
      {open && filtered.length === 0 && <p role="status" className="mt-2 text-xs text-neutral-500">Нет совпадений.{!selected.includes("Другое") && " Можно выбрать «Другое»."}</p>}
      {selected.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2" aria-label="Выбранные предметы">
          {selected.map((subject) => (
            <button
              key={subject}
              type="button"
              onClick={() => onChange(selected.filter((item) => item !== subject).join("; "))}
              aria-label={`Убрать ${subject}`}
              className="rounded-lg bg-brand-50 px-3 py-1.5 text-xs text-brand-600"
            >
              {subject} <span aria-hidden="true">×</span>
            </button>
          ))}
        </div>
      )}
    </fieldset>
  );
}
