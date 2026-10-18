"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import { SubjectSelectedCheckIcon } from "@/app/components/svg";
import { MAX_SUBJECTS } from "./subjects";

type Props = {
  options: string[];
  selected: string[];
  onSelect: (subject: string) => void;
};

export default function SubjectOptions({ options, selected, onSelect }: Props) {
  const t = useTranslations();
  return (
    <ul aria-label={t("consultation.subjectOptions.message0610")}>
      {options.map((subject) => (
        <li key={subject}>
          <label className={`relative flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2 text-sm leading-relaxed hover:bg-brand-50 has-disabled:cursor-not-allowed has-disabled:opacity-50 has-focus-visible:outline-2 has-focus-visible:outline-brand-500 ${selected.includes(subject) ? "text-brand-500" : "text-brand-700"}`}>
            <input type="checkbox" checked={selected.includes(subject)} disabled={!selected.includes(subject) && selected.length >= MAX_SUBJECTS} onChange={() => onSelect(subject)} className="peer sr-only" />
            <SubjectSelectedCheckIcon />
            <span>{t.content(subject)}</span>
          </label>
        </li>
      ))}
    </ul>
  );
}
