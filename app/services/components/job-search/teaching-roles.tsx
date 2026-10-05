import ProFitCard from "../../../programs/pro/pro-fit-card";
import { icons } from "../../../programs/components/icons";
import SubjectNames from "./subject-names";
import { teachingRolesIntroduction } from "./content";

export default function TeachingRoles() {
  return (
    <ProFitCard headingLevel="h3" id="teaching-roles" title="Какие вакансии искать за рубежом?" icon={icons.search} note="Найдите свою позицию" variant="search">
      <p>{teachingRolesIntroduction} Например:</p>
      <SubjectNames />
    </ProFitCard>
  );
}
