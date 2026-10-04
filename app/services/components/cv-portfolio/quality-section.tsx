import SectionHeading from "../section-heading";
import PortfolioFolder from "./portfolio-folder";

export default function QualitySection() {
  return (
    <section aria-labelledby="portfolio-quality" className="relative left-1/2 w-screen -translate-x-1/2 bg-linear-to-r from-blue-50 to-violet-100">
      <div className="mx-auto flex max-w-400 items-center gap-10 px-6 py-8 sm:px-10 lg:px-16 lg:py-10 xl:px-20">
        <div className="min-w-0 flex-1">
          <SectionHeading id="portfolio-quality" size="small">Главное — качество, а не количество</SectionHeading>
          <span aria-hidden="true" className="mt-4 block h-1 w-12 rounded-full bg-brand-400" />
          <p className="mt-5 max-w-[64ch] leading-relaxed text-neutral-600">Не стоит собирать десятки страниц документов и фотографий только для того, чтобы портфолио выглядело большим.</p>
          <p className="mt-3 max-w-[64ch] leading-relaxed text-neutral-600">Каждый материал должен помогать школе лучше понять вас как специалиста.</p>
          <p className="mt-6 text-xl font-medium leading-relaxed text-brand-600">CV говорит о вашем опыте. Портфолио показывает его.</p>
        </div>
        <PortfolioFolder className="hidden w-44 shrink-0 sm:block lg:w-52" />
      </div>
    </section>
  );
}
