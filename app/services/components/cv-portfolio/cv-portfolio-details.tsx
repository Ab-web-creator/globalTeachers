import BackLink from "../back-link";
import CvGuide from "./cv-guide";
import CvSupport from "./cv-support";
import CvHero from "./cv-hero";

export default function CvPortfolioDetails() {
  return (
    <main className="mx-auto max-w-400 px-6 pt-6 pb-12 sm:px-10 lg:px-16 lg:pt-8 lg:pb-20 xl:px-20">
      <BackLink />
      <article>
        <CvHero />
        <div className="mt-12 space-y-16 sm:mt-16 sm:space-y-20 lg:mt-20 lg:space-y-24">
          <CvGuide />
          <CvSupport />
        </div>
      </article>
    </main>
  );
}
