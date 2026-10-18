"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import { careerStageIconPaths } from "@/app/components/svg";
import Image from "next/image";
import SectionFade from "../cv-portfolio/section-fade";
import SectionLabel from "../job-search/section-label";
import SectionHeading from "../section-heading";
import VerticalStageTabs from "../vertical-stage-tabs";
import { stagesIntroduction, supportSections } from "./content";
import SupportVaseAnimation from "./support-vase-animation";
import styles from "./support-stages.module.css";

export default function SupportStages() {
  const t = useTranslations();
  return (
    <section aria-labelledby="support-stages" className="relative isolate py-12 sm:py-16 lg:py-20">
      <SectionFade />
      <div className="grid items-start gap-8 min-[1000px]:grid-cols-12">
        <div className="w-full min-w-0 min-[1000px]:col-span-8 min-[1000px]:max-w-3xl">
          <SectionLabel>{t("services.careerSupport.supportStages.message1418")}</SectionLabel>
          <SectionHeading id="support-stages">{t("services.careerSupport.supportStages.message1419")}{" "}<span className="text-brand-500">{t("services.careerSupport.supportStages.message1420")}</span></SectionHeading>
          <p className="mt-7 text-lg leading-relaxed text-neutral-600">{t.content(stagesIntroduction)}</p>
          <div className={`${styles.stableTabs} mt-10 [&_[role=tab]]:py-2 [&_[role=tab]_svg]:hidden sm:[&_[role=tab]]:py-4 sm:[&_[role=tab]_svg]:block`}>
            <VerticalStageTabs
              id="career-support-stages"
              autoPreview
              reservePanelHeight
              label={t("services.careerSupport.supportStages.message1418")}
              labels={["Стратегия", "Вакансии", "Заявки", "Интервью"]}
              paths={careerStageIconPaths}
              stages={supportSections}
            />
          </div>
        </div>
        <div className="relative hidden w-full max-w-sm justify-self-center min-[1000px]:col-span-4 min-[1000px]:self-end min-[1000px]:-translate-y-24 min-[1000px]:block">
          <Image src="/images/career-support-stage-vase-v12.webp" alt={t("services.careerSupport.supportStages.message1421")} width={1024} height={1536} sizes="(min-width: 1280px) 384px, 30vw" className="-mb-[6.9%] h-auto w-full object-contain" />
          <SupportVaseAnimation />
        </div>
      </div>
    </section>
  );
}
