import TargetedApplications, { ApplicationChecks } from "./targeted-applications";
import TeachingRoles from "./teaching-roles";

export default function ApplicationAdvice() {
  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2 bg-linear-to-b from-brand-300 via-brand-300/30 to-white pt-12 sm:pt-16 lg:pt-20">
      <div className="mx-auto grid max-w-400 gap-5 px-6 sm:px-10 lg:grid-cols-3 lg:px-16 xl:px-20">
        <TeachingRoles />
        <TargetedApplications />
        <ApplicationChecks />
      </div>
    </div>
  );
}
