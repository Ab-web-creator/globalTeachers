"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import PageTitle from "../page-title";
import SectionLabel from "../job-search/section-label";
import { introduction } from "./content";
import ServiceHero from "../service-hero";
import CvQuote from "./cv-quote";

export default function CvHero() {
  const t = useTranslations();
  return (
    <ServiceHero image="/images/cv-portfolio-hero.webp" imageHeightScale={0.95}>
      <SectionLabel>{t("services.cvPortfolio.cvHero.message1478")}</SectionLabel>
      <PageTitle>
        {t("services.cvPortfolio.cvHero.message1479")}{" "}<span className="text-brand-500">{t("services.cvPortfolio.cvHero.message1480")}</span>
      </PageTitle>
      <div className="mt-7 space-y-5">
        {introduction.map((text) => <p key={text} className="text-base leading-relaxed text-neutral-600 sm:text-lg">{t.content(text)}</p>)}
      </div>
      <CvQuote />
    </ServiceHero>
  );
}
