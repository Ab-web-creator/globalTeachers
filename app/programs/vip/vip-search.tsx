import { programIconPaths } from "@/app/components/svg";
import Image from "next/image";
import SectionLabel from "../../services/components/job-search/section-label";
import SectionHeading from "../../services/components/section-heading";
import VerticalStageTabs from "../../services/components/vertical-stage-tabs";
import { searchIntroduction, searchStages } from "./content";
import TreePotAnimation from "./tree-pot-animation";

export default function VipSearch() {
  return (
    <section aria-labelledby="vip-search" className="relative isolate py-12 sm:py-16 lg:py-20">
      <div className="grid items-start gap-8 min-[1000px]:grid-cols-12">
        <div className="w-full min-w-0 min-[1000px]:col-span-8 min-[1000px]:max-w-3xl">
          <SectionLabel>Поиск вместе</SectionLabel>
          <SectionHeading id="vip-search">Когда поиск <span className="text-brand-500">уже начался</span></SectionHeading>
          <p className="mt-7 text-lg leading-relaxed text-neutral-600">{searchIntroduction}</p>
          <div className="mt-10">
            <VerticalStageTabs id="vip-search" autoPreview label="Этапы поиска" labels={["Вакансии", "Заявки", "Интервью"]} paths={[programIconPaths.search, programIconPaths.document, programIconPaths.chat]} stages={searchStages} />
          </div>
        </div>
        <div className="hidden w-full min-[1000px]:col-span-4 min-[1000px]:self-end min-[1000px]:block">
          <div className="relative mx-auto w-3/4">
            <Image src="/images/vip-career-tree-box-v6.png" alt="Японский клён в сиреневом горшке с изображениями CV, школы и заметок для интервью" width={971} height={1620} sizes="(min-width: 1600px) 336px, 25vw" className="h-auto w-full object-contain" />
            <TreePotAnimation />
          </div>
        </div>
      </div>
    </section>
  );
}
