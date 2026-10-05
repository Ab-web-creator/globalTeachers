import ProgramSection from "../components/program-section";
import Prose from "../components/prose";
import AfterOfferSteps from "./after-offer-steps";
import AfterOfferVisual from "./after-offer-visual";
import { afterOffer } from "./content";

export default function VipAfterOffer() {
  return (
    <ProgramSection
      id="vip-after-offer"
      label="После оффера"
      title={<>Предложение принято.<br /><span className="text-brand-500">Что дальше?</span></>}
      fade="violet"
      fadeDirection="down"
      fadeToWhite
      aside={<AfterOfferVisual />}
      footer={<AfterOfferSteps />}
    >
      <Prose paragraphs={afterOffer.paragraphs} />
      <p className="mt-6 text-lg font-semibold leading-relaxed text-brand-600">{afterOffer.closing}</p>
    </ProgramSection>
  );
}
