"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
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
  const t = useTranslations();
  const search = useRef<HTMLInputElement>(null);
  useEffect(() => {
    search.current?.focus({ preventScroll: true });
  }, []);

  return (
    <div className="flex min-h-12.5 min-w-0 items-center sm:h-full rounded-xl border border-brand-200 bg-white p-2 pr-14 focus-within:border-brand-500">
      <label htmlFor="subject-search" className="sr-only">{t("consultation.subjectSearchField.message0615")}</label>
      <div className="flex w-full min-w-0 flex-wrap items-center gap-2 sm:flex-nowrap sm:overflow-x-auto">
        <SelectedSubjects selected={selected} onRemove={(subject) => { onRemove(subject); search.current?.focus({ preventScroll: true }); }} />
        <input
          ref={search}
          id="subject-search"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={t.content(selected.length ? "" : "Поиск по предметам")}
          autoComplete="off"
          className={`${styles.input} w-24 min-w-24 flex-1 rounded-md bg-transparent px-2 py-1 text-base text-brand-700`}
        />
      </div>
    </div>
  );
}
