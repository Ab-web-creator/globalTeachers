"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
export default function FlowChips({ text }: { text: string }) {
  const t = useTranslations();
  const steps = t.content(text).replace(/\.$/, "").split("→").map((step) => step.trim());

  return (
    <ol aria-label={t.content(text)} className="flex flex-wrap items-center gap-2">
      {steps.map((step, index) => (
        <li key={step} className="flex items-center gap-2">
          {index > 0 && <span aria-hidden="true" className="text-brand-400">→</span>}
          <span className="rounded-full bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-600">{t.content(step)}</span>
        </li>
      ))}
    </ol>
  );
}
