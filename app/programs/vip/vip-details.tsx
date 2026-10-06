import type { Program } from "../../components/home/categories/programs";
import ProgramCta from "../components/program-cta";
import ProgramHero from "../components/program-hero";
import ProgramPage from "../components/program-page";
import { cta, hero } from "./content";
import VipPreparation from "./vip-preparation";
import VipSupport from "./vip-support";

export default function VipDetails({ program }: { program: Program }) {
  const title = <>Вы занимаетесь своей работой. Мы помогаем вам <span className="text-brand-500">строить следующую карьеру</span>.</>;

  return (
    <ProgramPage bottomPadding="60px" hero={<ProgramHero tier="VIP" image="/images/vip-personal-support-hero-cropped.png" title={title} intro={hero.intro} highlight={hero.highlight} imageHeightScale={0.95} />}>
      <VipPreparation />
      <VipSupport>
        <ProgramCta tier="VIP" price={program.price} title={cta.title} text={cta.text} image="/images/benefits/flights.jpg" />
      </VipSupport>
    </ProgramPage>
  );
}
