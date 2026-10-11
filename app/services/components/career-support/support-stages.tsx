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
  return (
    <section aria-labelledby="support-stages" className="relative isolate py-12 sm:py-16 lg:py-20">
      <SectionFade />
      <div className="grid items-start gap-8 min-[1000px]:grid-cols-12">
        <div className="w-full min-w-0 min-[1000px]:col-span-8 min-[1000px]:max-w-3xl">
          <SectionLabel>Этапы сопровождения</SectionLabel>
          <SectionHeading id="support-stages">Как проходит <span className="text-brand-500">сопровождение?</span></SectionHeading>
          <p className="mt-7 text-lg leading-relaxed text-neutral-600">{stagesIntroduction}</p>
          <div className={`${styles.stableTabs} mt-10 [&_[role=tab]]:py-2 [&_[role=tab]_svg]:hidden sm:[&_[role=tab]]:py-4 sm:[&_[role=tab]_svg]:block`}>
            <VerticalStageTabs
              id="career-support-stages"
              autoPreview
              reservePanelHeight
              label="Этапы сопровождения"
              labels={["Стратегия", "Вакансии", "Заявки", "Интервью"]}
              paths={careerStageIconPaths}
              stages={supportSections}
            />
          </div>
        </div>
        <div className="relative hidden w-full max-w-sm justify-self-center min-[1000px]:col-span-4 min-[1000px]:self-end min-[1000px]:-translate-y-24 min-[1000px]:block">
          <Image src="/images/career-support-stage-vase-v12.webp" alt="Букет красных гладиолусов, оранжевых маков и фиолетовых астр в сиреневой вазе с символами стратегии, поиска вакансий, заявок и интервью" width={1024} height={1536} sizes="(min-width: 1280px) 384px, 30vw" className="-mb-[6.9%] h-auto w-full object-contain" />
          <SupportVaseAnimation />
        </div>
      </div>
    </section>
  );
}
