import SearchSupport from "./search-support";
import FirstSteps from "./first-steps";
import GradientBand from "./gradient-band";
import RecruitmentPlatforms from "./recruitment-platforms";
import SearchTiming from "./search-timing";
import ApplicationAdvice from "./application-advice";
import VacancySources from "./vacancy-sources";

export default function SearchGuide() {
  return (
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
      <div className="pb-12 sm:pb-0"><SearchSupport /></div>
    </div>
  );
}
