"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import { programIconPaths } from "@/app/components/svg";
import ProFitCard from "../../../programs/pro/pro-fit-card";
import { preparationSteps } from "./content";

export default function InterviewPractice() {
  const t = useTranslations();
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <ProFitCard headingLevel="h3" id="demo-lesson" title="Demo Lesson" icon={programIconPaths.school} note="Покажите себя в деле" variant="lesson">
        <p>{t("services.interviewPreparation.interviewPractice.message1615")}</p>
        <p>{t("services.interviewPreparation.interviewPractice.message1616")}</p>
      </ProFitCard>
      <ProFitCard headingLevel="h3" id="before-interview" title={t("services.interviewPreparation.interviewPractice.message1617")} icon={programIconPaths.checklist} note="Подготовка даёт уверенность" variant="checklist">
        <ol className="space-y-2">
          {preparationSteps.map((text, index) => (
            <li key={text} className="flex items-baseline gap-4">
              <span aria-hidden="true" className="font-semibold tabular-nums text-brand-500">{t.content(String(index + 1).padStart(2, "0"))}</span>
              {t.content(text)}
            </li>
          ))}
        </ol>
      </ProFitCard>
      <ProFitCard headingLevel="h3" id="choosing-school" title={t("services.interviewPreparation.interviewPractice.message1619")} icon={programIconPaths.compass} note="Вы тоже выбираете" variant="choice">
        <p>{t("services.interviewPreparation.interviewPractice.message1621")}</p>
        <p>{t("services.interviewPreparation.interviewPractice.message1622")}</p>
        <p className="border-t border-brand-200/60 pt-5 font-semibold text-brand-600">{t("services.interviewPreparation.interviewPractice.message1623")}</p>
      </ProFitCard>
    </div>
  );
}
