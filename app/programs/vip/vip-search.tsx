import Image from "next/image";
import SectionHeading from "../../services/components/section-heading";
import SectionLabel from "../../services/components/job-search/section-label";
import { searchIntroduction } from "./content";
import SearchStageTabs from "./search-stage-tabs";

export default function VipSearch() {
  return (
    <section aria-labelledby="vip-search" className="relative isolate py-12 sm:py-16 lg:py-20">
      <div className="grid items-start gap-8 min-[1000px]:grid-cols-12">
        <div className="w-full min-w-0 min-[1000px]:col-span-8 min-[1000px]:max-w-3xl">
          <SectionLabel>Поиск вместе</SectionLabel>
          <SectionHeading id="vip-search">Когда поиск <span className="text-brand-500">уже начался</span></SectionHeading>
          <p className="mt-7 text-lg leading-relaxed text-neutral-600">{searchIntroduction}</p>
          <div className="mt-10">
            <SearchStageTabs />
          </div>
        </div>
        <div className="hidden w-full min-[1000px]:col-span-4 min-[1000px]:mt-40 min-[1000px]:block">
          <Image src="/images/start-search-plan-illustration-v2.webp" alt="План поиска работы, школы и документы кандидата" width={768} height={768} sizes="30vw" className="h-auto w-full object-contain" />
        </div>
      </div>
    </section>
  );
}
