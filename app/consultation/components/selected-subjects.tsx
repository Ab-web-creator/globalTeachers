"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import { SubjectTagRemoveIcon } from "@/app/components/svg";

type Props = {
  selected: string[];
  onRemove: (subject: string) => void;
};

export default function SelectedSubjects({ selected, onRemove }: Props) {
  const t = useTranslations();
  if (!selected.length) return null;

  return (
    <div role="group" aria-label={t("consultation.consultationForm.message0476")} className="contents">
      {selected.map((subject) => (
        <span key={subject} className="flex max-w-full items-center gap-1 sm:shrink-0 rounded-md bg-brand-100 pl-3 text-sm text-brand-700">
          <span title={t.content(subject)} className="min-w-0 break-words sm:truncate">{t.content(subject)}</span>
          <button type="button" aria-label={t.content(`Убрать ${subject}`)} onClick={() => onRemove(subject)} className="flex size-8 shrink-0 items-center justify-center rounded-md hover:bg-brand-200 focus-visible:-outline-offset-2">
            <SubjectTagRemoveIcon />
          </button>
        </span>
      ))}
    </div>
  );
}
