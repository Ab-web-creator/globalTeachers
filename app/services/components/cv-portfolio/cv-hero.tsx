import { introduction } from "./content";
import CvHeroVisual from "./cv-hero-visual";
import CvQuote from "./cv-quote";
import SectionFade from "./section-fade";

export default function CvHero() {
  return (
    <header className="relative isolate mt-6 grid items-start gap-12 pb-12 sm:pb-16 lg:grid-cols-2 lg:gap-16 lg:pb-20">
      <SectionFade />
      <div className="lg:order-2">
        <p className="text-sm font-semibold tracking-widest text-brand-500 uppercase">CV и портфолио</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl xl:text-6xl">
          Как представить свой опыт <span className="text-brand-500">международной школе?</span>
        </h1>
        <div className="mt-8 space-y-5">
          {introduction.map((text) => <p key={text} className="text-base leading-relaxed text-neutral-600 sm:text-lg">{text}</p>)}
        </div>
        <CvQuote />
      </div>
      <CvHeroVisual className="lg:order-1" />
    </header>
  );
}
