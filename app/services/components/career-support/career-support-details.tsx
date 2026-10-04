import PageTitle from "../page-title";
import SectionLabel from "../job-search/section-label";
import ServiceHero from "../service-hero";
import { introduction } from "./content";
import SupportGuide from "./support-guide";
import CareerSupportBanner from "./career-support-banner";

export default function CareerSupportDetails() {
  return (
    <main className="mx-auto max-w-400 px-6 pt-6 pb-12 sm:px-10 lg:px-16 lg:pt-0 lg:pb-20 xl:px-20">
      <article>
        <ServiceHero image="/images/VIPpackage.jpeg">
          <SectionLabel>Карьерное сопровождение</SectionLabel>
          <PageTitle>Когда рядом есть человек, который знает весь процесс</PageTitle>
          {introduction.map((text) => <p key={text} className="mt-4 text-lg leading-relaxed text-neutral-600">{text}</p>)}
        </ServiceHero>
        <div className="mt-12 max-w-4xl space-y-10 sm:mt-16 sm:space-y-12 lg:mt-20">
          <SupportGuide />
        </div>
        <div className="mt-16 sm:mt-20 lg:mt-24">
          <CareerSupportBanner />
        </div>
      </article>
    </main>
  );
}
