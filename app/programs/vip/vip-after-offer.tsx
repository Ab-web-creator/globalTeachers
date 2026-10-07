import SectionHeading from "../../services/components/section-heading";
import SectionLabel from "../../services/components/job-search/section-label";
import SectionFade from "../../services/components/cv-portfolio/section-fade";
import Prose from "../components/prose";
import AfterOfferSteps from "./after-offer-steps";
import AfterOfferVisual from "./after-offer-visual";
import { afterOffer } from "./content";

export default function VipAfterOffer() {
  return (
    <section aria-labelledby="vip-after-offer" className="relative isolate py-12 sm:py-16 lg:py-20">
      <SectionFade tone="violet" direction="down" toWhite />
      <div className="grid items-center gap-10 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-7">
          <SectionLabel>После оффера</SectionLabel>
          <SectionHeading id="vip-after-offer">Предложение принято.<br /><span className="text-brand-500">Что дальше?</span></SectionHeading>
          <Prose paragraphs={afterOffer.paragraphs} />
          <p className="mt-6 text-lg font-semibold leading-relaxed text-neutral-600">{afterOffer.closing}</p>
        </div>
        <div className="md:col-span-5">
          <AfterOfferVisual />
        </div>
      </div>
      <div className="mt-10">
        <AfterOfferSteps />
      </div>
    </section>
  );
}
