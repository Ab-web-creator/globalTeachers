import { useEffect, useRef } from "react";
import SelectedSubjects from "./selected-subjects";
import styles from "./subject-search-field.module.css";

type Props = {
  query: string;
  selected: string[];
  onQueryChange: (query: string) => void;
  onRemove: (subject: string) => void;
};

export default function SubjectSearchField({ query, selected, onQueryChange, onRemove }: Props) {
  const search = useRef<HTMLInputElement>(null);
  useEffect(() => {
    search.current?.focus({ preventScroll: true });
  }, []);

  return (
    <div className="flex min-h-14 min-w-0 flex-wrap items-center gap-2 rounded-xl border border-brand-200 bg-white p-2 pr-14 focus-within:border-brand-500">
      <label htmlFor="subject-search" className="sr-only">Поиск по предметам</label>
      <SelectedSubjects selected={selected} onRemove={(subject) => { onRemove(subject); search.current?.focus({ preventScroll: true }); }} />
      <input
        ref={search}
        id="subject-search"
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder={selected.length ? "" : "Поиск по предметам"}
        autoComplete="off"
        className={`${styles.input} w-8 min-w-8 flex-1 rounded-md bg-transparent px-2 py-1 text-base text-brand-700`}
      />
    </div>
  );
}
