import GuideCard from "./guide-card";
import { internationalTeachingRoles, teachingRoles } from "./content";

export default function TeachingRoles() {
  return (
    <GuideCard id="teaching-roles" label="Ваша специализация" title="Какие вакансии искать за рубежом?">
      <ul className="space-y-6">
        {teachingRoles.map(([russian, english]) => (
          <li key={russian}><span className="font-medium">{russian}</span> — {english}</li>
        ))}
      </ul>
      <ul className="space-y-6">
        {internationalTeachingRoles.map(([english, russian]) => (
          <li key={english}><span className="font-medium">{english}</span> — {russian}</li>
        ))}
      </ul>
    </GuideCard>
  );
}
