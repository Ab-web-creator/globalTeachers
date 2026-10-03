import TargetedApplications, { ApplicationChecks } from "./targeted-applications";
import TeachingRoles from "./teaching-roles";

export default function ApplicationAdvice() {
  return (
    <div className="flex flex-col gap-12 lg:flex-row lg:justify-between lg:gap-8 lg:*:max-w-88 lg:*:flex-1">
      <TeachingRoles />
      <TargetedApplications />
      <ApplicationChecks />
    </div>
  );
}
