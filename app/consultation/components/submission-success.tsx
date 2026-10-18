"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import { useEffect, useRef } from "react";

type Props = { email: string; onNew: () => void; onClose: () => void };

export default function SubmissionSuccess({ email, onNew, onClose }: Props) {
  const t = useTranslations();
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, []);

  return (
    <div role="dialog" aria-labelledby="verification-heading" className="fixed inset-0 z-50 flex flex-col overflow-y-auto overscroll-contain bg-white px-4 py-8 lg:absolute lg:rounded-3xl lg:p-8 xl:p-10">
      <div className="my-auto py-8">
        <h2 ref={heading} tabIndex={-1} id="verification-heading" className="text-2xl font-semibold outline-none">{t("consultation.submissionSuccess.message0640")}</h2>
        <p className="mt-7 text-base leading-relaxed">{t("consultation.submissionSuccess.message0641")}{" "}<strong className="break-all">{t.content(email)}</strong>{t("consultation.submissionSuccess.message0642")}</p>
        <p className="mt-6 text-base leading-relaxed text-neutral-500">{t("consultation.submissionSuccess.message0643")}</p>
        <p className="mt-7 text-sm leading-relaxed text-neutral-600">{t("consultation.submissionSuccess.message0644")}{" "}<button type="button" onClick={onNew} className="text-brand-600 underline underline-offset-4 hover:text-brand-800">{t("consultation.submissionSuccess.message0645")}</button>.</p>
      </div>
      <button type="button" onClick={onClose} className="action-gradient mt-auto min-h-12 w-fit shrink-0 rounded-xl px-8 py-3 font-medium text-white">{t("common.close")}</button>
      <p className="flex items-start gap-2 pt-8 text-xs leading-relaxed text-neutral-500"><span aria-hidden="true">◇</span>{t("consultation.submissionSuccess.message0646")}</p>
    </div>
  );
}
