import TargetedApplications, { ApplicationChecks } from "./targeted-applications";
import TeachingRoles from "./teaching-roles";

export default function ApplicationAdvice() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <TeachingRoles />
      <TargetedApplications />
      <ApplicationChecks />
    </div>
  );
}
