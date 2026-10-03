import GuideCard from "./guide-card";
import { subjectNameExamples, teachingRolesIntroduction } from "./content";

export default function TeachingRoles() {
  return (
    <GuideCard id="teaching-roles" title="Какие вакансии искать за рубежом?">
      <p>
        {teachingRolesIntroduction} Например:{" "}
        {subjectNameExamples.map(([russian, english], index) => (
          <span key={english}>
            {russian} — <span className="font-semibold text-brand-950">{english}</span>
            {index < subjectNameExamples.length - 1 ? "; " : "."}
          </span>
        ))}
      </p>
    </GuideCard>
  );
}
