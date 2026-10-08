import SectionHeading from "../section-heading";
import SectionFade from "../cv-portfolio/section-fade";
import SectionLabel from "../job-search/section-label";
import VerticalStageTabs from "../vertical-stage-tabs";
import { stagesIntroduction, supportSections } from "./content";
import { stageIcons } from "./icons";

export default function SupportStages() {
  return (
    <section aria-labelledby="support-stages" className="relative isolate py-12 sm:py-16 lg:py-20">
      <SectionFade />
      <div className="grid items-start gap-8 min-[1000px]:grid-cols-12">
        <div className="w-full min-w-0 min-[1000px]:col-span-8 min-[1000px]:max-w-3xl">
          <SectionLabel>Этапы сопровождения</SectionLabel>
          <SectionHeading id="support-stages">Как проходит <span className="text-brand-500">сопровождение?</span></SectionHeading>
          <p className="mt-7 text-lg leading-relaxed text-neutral-600">{stagesIntroduction}</p>
          <div className="mt-10">
            <VerticalStageTabs
              id="career-support-stages"
              autoPreview
              label="Этапы сопровождения"
              labels={["Стратегия", "Вакансии", "Заявки", "Интервью"]}
              paths={stageIcons}
              stages={supportSections}
            />
          </div>
        </div>
        <div className="hidden w-full min-[1000px]:col-span-4 min-[1000px]:mt-40 min-[1000px]:block">
          <Image src="/images/career-support-plan-transparent.webp" alt="План поиска работы, школы и документы кандидата" width={1254} height={1254} sizes="30vw" className="h-auto w-full object-contain" />
        </div>
      </div>
    </section>
  );
}
import Image from "next/image";
