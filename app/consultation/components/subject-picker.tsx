"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import SubjectOptions from "./subject-options";
import { MAX_SUBJECTS, subjects } from "./subjects";
import { normalizeUzbekSearch } from "@/lib/i18n/uzbek-alphabet";

type Props = {
  query: string;
  availableSubjects?: readonly string[];
  selected: string[];
  onSelect: (subject: string) => void;
  onDone: () => void;
};

export default function SubjectPicker({ query, selected, onSelect, onDone, availableSubjects = subjects }: Props) {
  const t = useTranslations();
  const normalized = normalizeUzbekSearch(query);
  const options = availableSubjects.filter((subject) =>
    normalizeUzbekSearch(t.content(subject)).includes(normalized)
    || normalizeUzbekSearch(subject).includes(normalized),
  );

  return (
    <div id="subject-picker" className="flex min-h-0 flex-1 flex-col rounded-xl border border-brand-200 bg-white p-2">
      <p className="shrink-0 px-3 py-2 text-sm text-neutral-500">{t("consultation.subjectPicker.message0611")}{" "}{MAX_SUBJECTS} {" "}{t("consultation.subjectPicker.message0612")}</p>
      <div key={normalized} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <SubjectOptions options={options} selected={selected} onSelect={onSelect} />
        {options.length === 0 && <p role="status" className="p-3 text-sm text-neutral-500">{t("consultation.subjectPicker.message0613")}</p>}
      </div>
      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-brand-100 px-3 py-2">
        <p role="status" className="text-sm text-neutral-500">{t("consultation.subjectPicker.message0614")}{" "}{selected.length} {" "}{t("client.clientFiles.message0105")}{" "}{MAX_SUBJECTS}</p>
        <button type="button" onClick={onDone} className="rounded-xl bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600 focus-visible:-outline-offset-2">{t("client.workspacePanel.message0190")}</button>
      </div>
    </div>
  );
}
