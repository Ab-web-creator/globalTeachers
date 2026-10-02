import FirstSteps from "./first-steps";
import RecruitmentPlatforms from "./recruitment-platforms";
import SearchTiming from "./search-timing";
import TargetedApplications, { ApplicationChecks } from "./targeted-applications";
import TeachingRoles from "./teaching-roles";
import VacancySources from "./vacancy-sources";

export default function SearchGuide() {
  return (
    <div className="space-y-16 sm:space-y-24 lg:space-y-32">
      <div className="space-y-16 sm:space-y-20">
        <VacancySources />
        <RecruitmentPlatforms />
      </div>
      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-linear-to-br from-sky-100 via-blue-50 to-violet-100">
        <div className="relative z-10 mx-auto max-w-400 px-6 py-10 sm:px-10 sm:py-12 lg:px-16 lg:py-16 xl:px-20">
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-10">
              <TeachingRoles />
              <TargetedApplications />
            </div>
            <SearchTiming />
          </div>
        </div>
      </div>
      <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <ApplicationChecks />
        <FirstSteps />
      </div>
    </div>
  );
}
