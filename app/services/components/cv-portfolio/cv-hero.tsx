import PageTitle from "../page-title";
import SectionLabel from "../job-search/section-label";
import { introduction } from "./content";
import ServiceHero from "../service-hero";
import CvQuote from "./cv-quote";

export default function CvHero() {
  return (
    <ServiceHero image="/images/startPackage.jpeg" imageHeightScale={0.95}>
      <SectionLabel>CV и портфолио</SectionLabel>
      <PageTitle>
        Как представить свой опыт <span className="text-brand-500">международной школе?</span>
      </PageTitle>
      <div className="mt-7 space-y-5">
        {introduction.map((text) => <p key={text} className="text-base leading-relaxed text-neutral-600 sm:text-lg">{text}</p>)}
      </div>
      <CvQuote />
    </ServiceHero>
  );
}
