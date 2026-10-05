import CareerSupportHero from "./career-support-hero";
import CareerSupportBanner from "./career-support-banner";
import OfferReview from "./offer-review";
import RelocationSteps from "./relocation-steps";
import SupportMeaning from "./support-meaning";
import SupportStages from "./support-stages";

export default function CareerSupportDetails() {
  return (
    <main className="mx-auto max-w-400 px-6 pt-6 pb-15 sm:px-10 lg:px-16 lg:pt-0 xl:px-20">
      <article>
        <CareerSupportHero />
        <div>
          <SupportStages />
          <div>
            <OfferReview />
            <SupportMeaning />
          </div>
          <RelocationSteps />
          <div className="pb-12 sm:pb-0"><CareerSupportBanner /></div>
        </div>
      </article>
    </main>
  );
}
