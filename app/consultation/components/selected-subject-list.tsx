"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import { SubjectListRemoveIcon } from "@/app/components/svg";

type Props = {
  selected: string[];
  onRemove: (subject: string) => void;
};

export default function SelectedSubjectList({ selected, onRemove }: Props) {
  const t = useTranslations();
  if (!selected.length) return null;

  return (
    <ul aria-label={t("consultation.consultationForm.message0476")} className="relative mr-12 flex min-h-12 min-w-0 flex-wrap items-center gap-2 px-2 py-2 sm:h-full sm:flex-nowrap sm:overflow-x-auto sm:py-1">
      {selected.map((subject) => (
        <li key={subject} className="flex max-w-full items-center gap-2 rounded-lg sm:shrink-0 bg-brand-50 pl-3 pr-1 text-sm text-brand-600">
          <span className="min-w-0 break-words sm:whitespace-nowrap">{t.content(subject)}</span>
          <button type="button" aria-label={t.content(`Убрать ${t.content(subject)}`)} onClick={() => onRemove(subject)} className="pointer-events-auto flex size-8 shrink-0 items-center justify-center rounded-md hover:bg-brand-100 focus-visible:-outline-offset-2">
            <SubjectListRemoveIcon />
          </button>
        </li>
      ))}
    </ul>
  );
}
