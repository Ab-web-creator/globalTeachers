"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import { consultationSteps } from "./consultation-steps";

export default function StepIndicator({ step }: { step: number }) {
  const t = useTranslations();
  return (
    <div>
      <ol className="mt-4 flex gap-1 sm:gap-2" aria-label={t("consultation.stepIndicator.message0585")}>
        {consultationSteps.map(({ title }, index) => (
          <li key={title} aria-current={step === index ? "step" : undefined} className={`h-2 flex-1 rounded-full ${index <= step ? "bg-brand-500" : "bg-brand-100"}`}>
            <span className="sr-only">{index + 1}. {t.content(title)}{t.content(index < step ? " — завершён" : "")}</span>
          </li>
        ))}
      </ol>
      {step === 0 && <p className="mt-4 text-base leading-relaxed text-slate-600 lg:hidden">{t("consultation.consultationIntro.message0491")}</p>}
    </div>
  );
}
