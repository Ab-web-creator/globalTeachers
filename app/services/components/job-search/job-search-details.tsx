import ApplicationAdvice from "./application-advice";
import FirstSteps from "./first-steps";
import GradientBand from "./gradient-band";
import JobSearchHero from "./job-search-hero";
import RecruitmentPlatforms from "./recruitment-platforms";
import SearchSupport from "./search-support";
import SearchTiming from "./search-timing";
import VacancySources from "./vacancy-sources";

export default function JobSearchDetails() {
  return (
    <main className="bg-white pb-0 sm:pb-15 text-brand-700">
      <article>
        <JobSearchHero />
        <div className="mx-auto max-w-400 px-6 sm:px-10 lg:px-16 xl:px-20">
          <div>
            <VacancySources />
            <div>
              <GradientBand>
                <SearchTiming />
              </GradientBand>
              <RecruitmentPlatforms />
            </div>
            <FirstSteps>
              <ApplicationAdvice />
            </FirstSteps>
            <SearchSupport />
          </div>
        </div>
      </article>
    </main>
  );
}
