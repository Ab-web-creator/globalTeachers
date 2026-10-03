import { introduction } from "./content";
import CvHeroVisual from "./cv-hero-visual";
import CvQuote from "./cv-quote";

export default function CvHero() {
  return (
    <header className="mt-6 grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
      <div>
        <p className="text-sm font-semibold tracking-widest text-brand-500 uppercase">CV и портфолио</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl xl:text-6xl">
          Как представить свой опыт <span className="text-brand-500">международной школе?</span>
        </h1>
        <div className="mt-8 space-y-5">
          {introduction.map((text) => <p key={text} className="text-base leading-relaxed text-neutral-600 sm:text-lg">{text}</p>)}
        </div>
        <CvQuote />
      </div>
      <CvHeroVisual />
    </header>
  );
}
