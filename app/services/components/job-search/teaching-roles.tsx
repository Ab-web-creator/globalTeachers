import GuideCard from "./guide-card";
import SubjectNames from "./subject-names";
import { teachingRolesIntroduction } from "./content";

export default function TeachingRoles() {
  return (
    <GuideCard id="teaching-roles" title="Какие вакансии искать за рубежом?">
      <p className="text-justify">{teachingRolesIntroduction} Например:</p>
      <SubjectNames />
    </GuideCard>
  );
}
