import RecruitmentPlatforms from "./recruitment-platforms";
import SearchTiming from "./search-timing";
import TargetedApplications from "./targeted-applications";
import TeachingRoles from "./teaching-roles";
import VacancySources from "./vacancy-sources";

export default function SearchGuide() {
  return (
    <div className="space-y-12 sm:space-y-16">
      <div className="space-y-12">
        <VacancySources />
        <RecruitmentPlatforms />
      </div>
      <SearchTiming />
      <TeachingRoles />
      <TargetedApplications />
    </div>
  );
}
