import GuideCard from "./guide-card";
import { applicationChecks, applicationChecksTakeaway, targetedApplicationsTakeaway } from "./content";

export default function TargetedApplications() {
  return (
    <GuideCard as="div" id="targeted-applications" title="Не отправляйте одно резюме всем подряд.">
      <p>Работодатели за рубежом ценят персонализированные отклики. Покажите, что вы понимаете школу, её ценности и требования вакансии.</p>
      <p>Качество откликов всегда важнее их количества. Целевой подход повышает шансы на приглашение на собеседование.</p>
      <p className="text-brand-600">{targetedApplicationsTakeaway}</p>
    </GuideCard>
  );
}

export function ApplicationChecks() {
  return (
    <GuideCard as="div" id="application-checks" title="Перед отправкой заявки посмотрите.">
      <ul className="space-y-2">
        {applicationChecks.map((text) => (
          <li key={text} className="flex gap-4">
            <span aria-hidden="true" className="mt-2 size-2 shrink-0 rounded-full bg-gray-300" />
            <p>{text}</p>
          </li>
        ))}
      </ul>
      <p className="text-brand-600">{applicationChecksTakeaway}</p>
    </GuideCard>
  );
}
