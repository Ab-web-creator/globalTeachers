import type { Program } from "../../components/home/categories/programs";
import ProgramCta from "../components/program-cta";
import ProgramHero from "../components/program-hero";
import ProgramPageLayout from "../components/program-page-layout";
import { cta, hero } from "./content";
import VipAfterOffer from "./vip-after-offer";
import VipAudience from "./vip-audience";
import VipDifference from "./vip-difference";
import VipImportant from "./vip-important";
import VipOffer from "./vip-offer";
import VipPreparationOverview from "./vip-preparation-overview";
import VipSearch from "./vip-search";
import VipStrategy from "./vip-strategy";
import VipValue from "./vip-value";

export default function VipDetails({ program }: { program: Program; }) {
  const title = <>От первого шага до предложения</>;

  return (
    <ProgramPageLayout bottomPadding="60px" hero={<ProgramHero tier="VIP" image="/images/vip-personal-support-hero-cropped.webp" title={title} intro={hero.intro} highlight={hero.highlight} matchTextHeight />}>
      <VipDifference />
      <VipStrategy />
      <VipPreparationOverview />
      <VipSearch />
      <VipOffer />
      <VipAfterOffer />
      <VipValue />
      <VipAudience />
      <VipImportant />
      <div className="pb-12 sm:pb-0">
        <ProgramCta tier="VIP" price={program.price} title={cta.title} text={cta.text} image="/images/benefits/flights.jpg" />
      </div>
    </ProgramPageLayout>
  );
}
