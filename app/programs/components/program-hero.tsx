"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import type { ReactNode } from "react";
import PageTitle from "../../services/components/page-title";
import SectionLabel from "../../services/components/job-search/section-label";
import ServiceHero from "../../services/components/service-hero";

type Props = { tier: string; image: string; title: ReactNode; intro: readonly string[]; introClassName?: string; highlight: string; imageAspectRatio?: string; imageHeightScale?: number; imageTopCrop?: number; matchTextHeight?: boolean };

export default function ProgramHero({ tier, image, title, intro, introClassName = "text-base sm:text-lg", highlight, imageAspectRatio, imageHeightScale, imageTopCrop, matchTextHeight }: Props) {
  const t = useTranslations();
  return (
    <ServiceHero image={image} backHref="/#plans" imageAspectRatio={imageAspectRatio} stretchImage={!imageAspectRatio} imageHeightScale={imageHeightScale} imageTopCrop={imageTopCrop} matchTextHeight={matchTextHeight}>
      <SectionLabel>{tier === "START" ? t("programs.programHero.startLabel") : <>{t("programs.programHero.message1113")}{" "}{t.content(tier)}</>}</SectionLabel>
      <PageTitle>{t.content(title)}</PageTitle>
      <div className="mt-6 space-y-5">
        {intro.map((text) => <p key={text} className={`${introClassName} leading-relaxed text-neutral-600`}>{t.content(text)}</p>)}
      </div>
      <p className="mt-5 border-l-2 border-brand-300 pl-4 text-lg font-medium leading-relaxed text-brand-600">{t.content(highlight)}</p>
    </ServiceHero>
  );
}
