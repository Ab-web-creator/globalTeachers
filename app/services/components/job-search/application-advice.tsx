import TargetedApplications, { ApplicationChecks } from "./targeted-applications";
import TeachingRoles from "./teaching-roles";

export default function ApplicationAdvice() {
  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2 bg-amber-50/50">
      <div className="mx-auto grid max-w-400 items-stretch gap-6 px-6 py-12 sm:px-10 sm:py-16 lg:grid-cols-3 lg:gap-8 lg:px-16 xl:px-20">
        <TeachingRoles />
        <TargetedApplications />
        <ApplicationChecks />
      </div>
    </div>
  );
}
