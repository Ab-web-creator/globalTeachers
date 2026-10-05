import CareerSupportHero from "./career-support-hero";
import OfferReview from "./offer-review";
import RelocationSteps from "./relocation-steps";
import SupportMeaning from "./support-meaning";
import SupportStages from "./support-stages";

export default function CareerSupportDetails() {
  return (
    <main className="mx-auto max-w-400 px-6 pt-6 pb-12 sm:px-10 sm:pb-16 lg:px-16 lg:pt-0 lg:pb-20 xl:px-20">
      <article>
        <CareerSupportHero />
        <div>
          <SupportStages />
          <div>
            <OfferReview />
            <SupportMeaning />
          </div>
          <RelocationSteps />
        </div>
      </article>
    </main>
  );
}
