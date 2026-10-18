"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import { programIconPaths } from "@/app/components/svg";
import ProFitCard from "../../../programs/pro/pro-fit-card";
import { applicationChecks, applicationChecksTakeaway, subjectNameExamples, targetedApplicationsTakeaway, teachingRolesIntroduction } from "./content";

export default function ApplicationAdvice() {
  const t = useTranslations();
  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2 bg-linear-to-b from-brand-300 via-brand-300/30 to-white pt-12 sm:pt-16 lg:pt-20">
      <div className="mx-auto grid max-w-400 gap-5 px-6 sm:px-10 lg:grid-cols-3 lg:px-16 xl:px-20">
        <ProFitCard headingLevel="h3" id="teaching-roles" title={t("services.jobSearch.applicationAdvice.message1642")} icon={programIconPaths.search} note="Найдите свою позицию" variant="search">
          <p>{t.content(teachingRolesIntroduction)} {" "}{t("services.jobSearch.applicationAdvice.message1644")}</p>
          <ul className="-mt-3 divide-y divide-brand-100">
            {subjectNameExamples.map(([russian, english]) => (<li key={english} className="flex flex-col gap-0.5 py-1.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-2">
              <span className="text-brand-800">{t.content(russian)}</span>
              <span aria-hidden="true" className="hidden h-1 min-w-6 flex-1 bg-[radial-gradient(circle,var(--color-neutral-400)_1px,transparent_1.5px)] bg-size-[10px_4px] bg-repeat-x sm:block" />
              <span className="text-brand-600 sm:text-right">{t.content(english)}</span>
            </li>))}
          </ul>
        </ProFitCard>
        <ProFitCard headingLevel="h3" id="targeted-applications" title={t("services.jobSearch.applicationAdvice.message1645")} icon={programIconPaths.target} note="Качество важнее количества" variant="application">
          <p>{t("services.jobSearch.applicationAdvice.message1647")}</p>
          <p>{t("services.jobSearch.applicationAdvice.message1648")}</p>
          <p className="border-t border-brand-200/60 pt-5 font-semibold text-brand-600">{t.content(targetedApplicationsTakeaway)}</p>
        </ProFitCard>
        <ProFitCard headingLevel="h3" id="application-checks" title={t("services.jobSearch.applicationAdvice.message1649")} icon={programIconPaths.checklist} note="Пять минут перед отправкой" variant="checklist">
          <ul className="space-y-2">
            {applicationChecks.map(text => (<li key={text} className="flex gap-4">
              <span aria-hidden="true" className="mt-2 size-2 shrink-0 rounded-full bg-gray-300" />
              <p>{t.content(text)}</p>
            </li>))}
          </ul>
          <p className="border-t border-brand-200/60 pt-5 font-semibold text-brand-600">{t.content(applicationChecksTakeaway)}</p>
        </ProFitCard>
      </div>
    </div>
  );
}
