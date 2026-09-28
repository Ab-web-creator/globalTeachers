import { useRef } from "react";
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
  return (
    <div className="mt-4 min-w-0 rounded-xl border border-brand-200 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-inset focus-within:ring-brand-500">
      <label htmlFor="subject-search" className="sr-only">Поиск по предметам</label>
      <input ref={search} id="subject-search" type="search" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Поиск по предметам" autoComplete="off" className={`${styles.input} block w-full min-w-0 rounded-xl bg-transparent px-4 py-3 text-base text-brand-700`} />
      <SelectedSubjects selected={selected} onRemove={(subject) => { onRemove(subject); search.current?.focus({ preventScroll: true }); }} />
    </div>
  );
}
