"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import PageTitle from "../page-title";
import SectionLabel from "../job-search/section-label";
import ServiceHero from "../service-hero";
import { heroQuote, introduction } from "./content";

export default function CareerSupportHero() {
  const t = useTranslations();
  return (
    <ServiceHero image="/images/career-compass.webp" imageAspectRatio="400 / 360" imageHeightScale={0.98}>
      <SectionLabel>{t("services.careerSupport.careerSupportHero.message1367")}</SectionLabel>
      <PageTitle>
        {t("services.careerSupport.careerSupportHero.message1368")}{" "}<span className="text-brand-500">{t("services.careerSupport.careerSupportHero.message1369")}</span>
      </PageTitle>
      <div className="mt-7 space-y-5">
        {introduction.map((text) => <p key={text} className="text-lg leading-relaxed text-neutral-600">{t.content(text)}</p>)}
      </div>
      <p className="mt-5 border-l-2 border-brand-300 pl-4 text-lg font-medium leading-relaxed text-brand-600">{heroQuote.map(text => t.content(text)).join(" ")}</p>
    </ServiceHero>
  );
}
