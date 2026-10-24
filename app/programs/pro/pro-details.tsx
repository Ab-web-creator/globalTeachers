"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import type { Program } from "../../components/home/categories/programs";
import ProgramCta from "../components/program-cta";
import ProgramHero from "../components/program-hero";
import ProgramPageLayout from "../components/program-page-layout";
import { cta, hero } from "./content";
import ProApproach from "./pro-approach";
import ProFit from "./pro-fit";
import ProInclusions from "./pro-inclusions";
import ProPractice from "./pro-practice";
import ProProblem from "./pro-problem";

export default function ProDetails({ program }: { program: Program; }) {
  const t = useTranslations();
  const title = <>{t("programs.pro.proDetails.message1172")}{" "}<span className="text-brand-500">{t("programs.pro.proDetails.message1173")}</span>{t("programs.pro.proDetails.titleEnding") && <> {t("programs.pro.proDetails.titleEnding")}</>}</>;

  return (
    <ProgramPageLayout bottomPadding="60px" hero={<ProgramHero tier="PRO" image="/images/pro-application-hero.webp" title={title} intro={hero.intro} introClassName="text-lg" highlight={hero.highlight} imageAspectRatio="250 / 207" />}>
      <ProProblem />
      <ProInclusions />
      <ProApproach />
      <ProPractice />
      <div className="relative isolate">
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 bg-linear-to-b from-sky-50 via-brand-100/40 via-20% to-white to-70%" />
        <ProFit />
        <ProgramCta tier="PRO" price={program.price} title={t.content(cta.title)} text={cta.text} image="/images/pro-development-wide.webp" imageClassName="object-top md:object-center" imageContainerClassName="aspect-3/2 md:aspect-auto md:h-full" />
      </div>
    </ProgramPageLayout>
  );
}
