"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import type { Program } from "../../components/home/categories/programs";
import ProgramCta from "../components/program-cta";
import ProgramHero from "../components/program-hero";
import ProgramPageLayout from "../components/program-page-layout";
import { approach, cta, hero } from "./content";
import StartAudience from "./start-audience";
import StartIncluded from "./start-included";
import StartOutcomes from "./start-outcomes";
import StartQuestions from "./start-questions";

export default function StartDetails({ program }: { program: Program; }) {
  const t = useTranslations();
  const title = <>{t("programs.start.startDetails.message1218")}{" "}<span className="text-brand-500">{t("programs.start.startDetails.message1219")}{" "}</span>{t("programs.start.startDetails.message1220")}</>;

  return (
    <ProgramPageLayout bottomPadding="60px" hero={<ProgramHero tier="START" image="/images/start-career-planning-hero.webp" title={title} intro={hero.intro} introClassName="text-lg" highlight={hero.highlight} imageAspectRatio="625 / 528" />}>
      <StartQuestions />
      <StartAudience />
      <StartOutcomes flow={approach.outcome} />
      <StartIncluded />
      <ProgramCta tier="START" price={program.price} title={t.content(cta.title)} text={cta.text} image="/images/start-career-options-wide.webp" imageClassName="object-center" imageContainerClassName="aspect-4/3 md:aspect-auto md:h-full" />
    </ProgramPageLayout>
  );
}
