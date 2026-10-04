import SearchSupport from "./search-support";
import FirstSteps from "./first-steps";
import GradientBand from "./gradient-band";
import RecruitmentPlatforms from "./recruitment-platforms";
import SearchTiming from "./search-timing";
import ApplicationAdvice from "./application-advice";
import VacancySources from "./vacancy-sources";

export default function SearchGuide() {
  return (
    <div className="space-y-16 sm:space-y-20 lg:space-y-24">
      <VacancySources />
      <div>
        <GradientBand>
          <SearchTiming />
        </GradientBand>
        <RecruitmentPlatforms />
      </div>
      <FirstSteps>
        <ApplicationAdvice />
        <div className="mt-12 sm:mt-16 lg:mt-20"><SearchSupport /></div>
      </FirstSteps>
    </div>
  );
}
