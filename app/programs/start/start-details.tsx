import type { Program } from "../../components/home/categories/programs";
import ProgramCta from "../components/program-cta";
import ProgramHero from "../components/program-hero";
import ProgramPage from "../components/program-page";
import { cta, hero } from "./content";
import StartGuide from "./start-guide";

export default function StartDetails({ program }: { program: Program }) {
  const title = <>Поймите, <span className="text-brand-500">куда двигаться</span>, прежде чем отправлять десятки резюме</>;

  return (
    <ProgramPage bottomPadding="60px" hero={<ProgramHero tier="START" image="/images/start-career-planning-hero.webp" title={title} intro={hero.intro} highlight={hero.highlight} imageAspectRatio="625 / 528" />}>
      <StartGuide>
        <ProgramCta tier="START" price={program.price} title={cta.title} text={cta.text} image="/images/start-career-options-wide.jpg" imageClassName="object-center" imageContainerClassName="aspect-4/3 md:aspect-auto md:h-full" />
      </StartGuide>
    </ProgramPage>
  );
}
