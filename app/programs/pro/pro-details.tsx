import type { Program } from "../../components/home/categories/programs";
import ProgramCta from "../components/program-cta";
import ProgramHero from "../components/program-hero";
import ProgramPage from "../components/program-page";
import { cta, hero } from "./content";
import ProGuide from "./pro-guide";

export default function ProDetails({ program }: { program: Program }) {
  const title = <>Будьте готовы не просто искать работу. Будьте готовы <span className="text-brand-500">её получить</span>.</>;

  return (
    <ProgramPage bottomPadding="60px" hero={<ProgramHero tier="PRO" image={program.image} title={title} intro={hero.intro} highlight={hero.highlight} imageAspectRatio="250 / 207" />}>
      <ProGuide>
        <ProgramCta tier="PRO" price={program.price} title={cta.title} text={cta.text} image="/images/benefits/development.jpg" />
      </ProGuide>
    </ProgramPage>
  );
}
