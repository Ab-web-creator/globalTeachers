import FirstSteps from "./first-steps";
import RecruitmentPlatforms from "./recruitment-platforms";
import SearchTiming from "./search-timing";
import ApplicationAdvice from "./application-advice";
import VacancySources from "./vacancy-sources";

export default function SearchGuide() {
  return (
    <div className="space-y-16 sm:space-y-20 lg:space-y-24">
      <VacancySources />
      <RecruitmentPlatforms />
      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-linear-to-br from-sky-100 via-blue-50 to-violet-100">
        <div className="relative z-10 mx-auto max-w-400 px-6 py-10 sm:px-10 sm:py-12 lg:px-16 lg:py-16 xl:px-20">
          <SearchTiming />
        </div>
      </div>
      <ApplicationAdvice />
      <FirstSteps />
    </div>
  );
}
