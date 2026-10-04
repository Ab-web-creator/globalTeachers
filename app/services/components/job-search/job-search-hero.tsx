import PageTitle from "../page-title";
import SectionLabel from "./section-label";
import Image from "next/image";
import BackLink from "../back-link";
import { introduction } from "./content";

export default function JobSearchHero() {
  return (
    <header className="relative isolate overflow-hidden bg-white">
      <div className="relative mx-auto grid max-w-400 lg:min-h-120 lg:grid-cols-2">
        <BackLink className="mx-6 mt-6 sm:mx-10 lg:absolute lg:top-10 lg:left-20 lg:m-0 xl:left-24" />
        <div className="relative z-10 flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-14 lg:order-2 lg:px-16 lg:py-16 xl:px-20">
          <SectionLabel>Поиск работы за рубежом</SectionLabel>
          <PageTitle>Где искать вакансии в международных школах?</PageTitle>
          <p className="mt-6 text-base leading-relaxed text-neutral-600">{introduction}</p>
          <p className="mt-5 border-l-2 border-brand-300 pl-4 text-base font-medium leading-relaxed text-brand-700">Главное — понимать, где искать, когда начинать и на какие позиции откликаться.</p>
        </div>
        <div className="relative mx-6 min-h-72 sm:mx-10 sm:min-h-96 lg:order-1 lg:mt-6 lg:mr-0 lg:ml-16 lg:min-h-full xl:ml-20">
          <Image src="/images/benefits/development.jpg" alt="" fill preload sizes="(min-width: 1600px) 800px, (min-width: 1024px) 50vw, 100vw" className="object-cover object-center" />
          <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-white via-transparent to-transparent lg:bg-linear-to-l" />
        </div>
      </div>
    </header>
  );
}
