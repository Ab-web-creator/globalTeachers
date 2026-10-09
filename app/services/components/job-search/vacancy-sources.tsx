import Image from "next/image";
import SectionHeading from "../section-heading";
import SectionLabel from "./section-label";
import { vacancySources, vacancySourcesIntroduction } from "./content";
import RegionMap from "./region-map";

export default function VacancySources() {
  return (
    <section aria-labelledby="vacancy-sources" className="py-12 sm:py-16 lg:py-20">
      <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <SectionLabel>Источники вакансий</SectionLabel>
          <SectionHeading id="vacancy-sources">Так где же искать вакансии?</SectionHeading>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-neutral-600">{vacancySourcesIntroduction}</p>
          <ul className="mt-10 space-y-6">
          {vacancySources.map(({ title, text }) => (
            <li key={title} className="flex gap-4">
              <span aria-hidden="true" className="mt-2.5 size-2 shrink-0 rounded-full bg-brand-500" />
              <div>
                <h3 className="text-lg font-semibold leading-snug">{title}</h3>
                <p className="mt-1.5 text-lg leading-relaxed text-neutral-600">{text}</p>
              </div>
            </li>
          ))}
          </ul>
        </div>
        <div className="mx-auto flex w-5/6 flex-col gap-6 lg:self-center">
          <div className="isolate mx-auto w-5/6 bg-brand-500">
            <Image src="/images/job_search_illust.jpeg" alt="" width={1600} height={533} sizes="(min-width: 1024px) 32vw, 69vw" className="h-auto w-full object-contain mix-blend-screen grayscale" />
          </div>
          <RegionMap />
        </div>
      </div>
    </section>
  );
}
