"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import PageTitle from "../page-title";
import ServiceHero from "../service-hero";
import SectionLabel from "./section-label";
import { introduction, vacancyFitIntroduction } from "./content";

export default function JobSearchHero() {
  const t = useTranslations();
  return (
    <div className="mx-auto max-w-400 px-6 pt-6 sm:px-10 lg:px-16 lg:pt-0 xl:px-20">
      <ServiceHero image="/images/job-search-hero.webp" imageHeightScale={0.95}>
        <SectionLabel>{t("services.jobSearch.jobSearchHero.message1699")}</SectionLabel>
        <PageTitle>{t("services.jobSearch.jobSearchHero.message1700")}</PageTitle>
        <p className="mt-7 text-lg leading-relaxed text-neutral-600">{t.content(introduction)}</p>
        <p className="mt-4 text-lg leading-relaxed text-neutral-600">{t.content(vacancyFitIntroduction)}</p>
        <p className="mt-5 border-l-2 border-brand-300 pl-4 text-lg font-medium leading-relaxed text-brand-600">{t("services.jobSearch.jobSearchHero.message1701")}</p>
      </ServiceHero>
    </div>
  );
}
