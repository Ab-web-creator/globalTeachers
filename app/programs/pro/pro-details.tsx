import type { Program } from "../../components/home/categories/programs";
import ProgramCta from "../components/program-cta";
import ProgramHero from "../components/program-hero";
import ProgramPageLayout from "../components/program-page-layout";
import { cta, hero } from "./content";
import ProApproach from "./pro-approach";
import ProFit from "./pro-fit";
import ProInclusions from "./pro-inclusions";
import ProPractice from "./pro-practice";
import ProProblem from "./pro-problem";

export default function ProDetails({ program }: { program: Program; }) {
  const title = <>Будьте готовы не просто искать работу. Будьте готовы <span className="text-brand-500">её получить</span>.</>;

  return (
    <ProgramPageLayout bottomPadding="60px" hero={<ProgramHero tier="PRO" image="/images/pro-application-hero.webp" title={title} intro={hero.intro} highlight={hero.highlight} imageAspectRatio="250 / 207" />}>
      <ProProblem />
      <ProInclusions />
      <ProApproach />
      <ProPractice />
      <div className="relative isolate">
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 bg-linear-to-b from-sky-50 via-brand-100/40 via-20% to-white to-70%" />
        <ProFit />
        <div className="pb-12 sm:pb-0">
          <ProgramCta tier="PRO" price={program.price} title={cta.title} text={cta.text} image="/images/pro-development-wide.jpg" imageClassName="object-top md:object-center" imageContainerClassName="aspect-3/2 md:aspect-auto md:h-full" />
        </div>
      </div>
    </ProgramPageLayout>
  );
}
