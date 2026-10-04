import PageTitle from "../page-title";
import SectionLabel from "../job-search/section-label";
import ServiceHero from "../service-hero";
import { heroQuote, introduction } from "./content";

export default function CareerSupportHero() {
  return (
    <ServiceHero image="/images/career-compass.png" imageAspectRatio="400 / 360">
      <SectionLabel>Карьерное сопровождение</SectionLabel>
      <PageTitle>
        Когда рядом есть человек, который <span className="text-brand-500">знает весь процесс</span>
      </PageTitle>
      <div className="mt-7 space-y-5">
        {introduction.map((text) => <p key={text} className="text-base leading-relaxed text-neutral-600 sm:text-lg">{text}</p>)}
      </div>
      <p className="mt-5 border-l-2 border-brand-300 pl-4 text-lg font-medium leading-relaxed text-brand-700">{heroQuote.join(" ")}</p>
    </ServiceHero>
  );
}
