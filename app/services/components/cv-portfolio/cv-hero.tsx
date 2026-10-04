import PageTitle from "../page-title";
import SectionLabel from "../job-search/section-label";
import { introduction } from "./content";
import CvHeroVisual from "./cv-hero-visual";
import CvQuote from "./cv-quote";
import SectionFade from "./section-fade";

export default function CvHero() {
  return (
    <header className="relative isolate mt-6 grid items-start gap-12 pb-12 sm:pb-16 lg:grid-cols-2 lg:gap-16 lg:pb-20">
      <SectionFade />
      <div className="lg:order-2">
        <SectionLabel>CV и портфолио</SectionLabel>
        <PageTitle>
          Как представить свой опыт <span className="text-brand-500">международной школе?</span>
        </PageTitle>
        <div className="mt-8 space-y-5">
          {introduction.map((text) => <p key={text} className="text-base leading-relaxed text-neutral-600 sm:text-lg">{text}</p>)}
        </div>
        <CvQuote />
      </div>
      <CvHeroVisual className="lg:order-1" />
    </header>
  );
}
