import PageTitle from "../page-title";
import ServiceHero from "../service-hero";
import SectionLabel from "./section-label";
import { introduction } from "./content";

export default function JobSearchHero() {
  return (
    <div className="mx-auto max-w-400 px-6 pt-6 sm:px-10 lg:px-16 lg:pt-0 xl:px-20">
      <ServiceHero image="/images/benefits/development.webp" imageHeightScale={0.95}>
        <SectionLabel>Поиск работы за рубежом</SectionLabel>
        <PageTitle>Где искать вакансии в международных школах?</PageTitle>
        <p className="mt-7 text-base leading-relaxed text-neutral-600 sm:text-lg">{introduction}</p>
        <p className="mt-5 border-l-2 border-brand-300 pl-4 text-lg font-medium leading-relaxed text-brand-600">Главное — понимать, где искать, когда начинать и на какие позиции откликаться.</p>
      </ServiceHero>
    </div>
  );
}
