import GuideCard from "./guide-card";
import { applicationChecks } from "./content";

export default function TargetedApplications() {
  return (
    <GuideCard id="targeted-applications" label="Подготовка откликов" title="Не отправляйте одно резюме всем подряд.">
      <p>Работодатели за рубежом ценят персонализированные отклики. Покажите, что вы понимаете школу, её ценности и требования вакансии.</p>
      <p>Качество откликов всегда важнее их количества. Целевой подход повышает шансы на приглашение на собеседование.</p>
    </GuideCard>
  );
}

export function ApplicationChecks() {
  return (
    <GuideCard id="application-checks" label="Проверка вакансии" title="Перед отправкой заявки посмотрите.">
      <ul className="space-y-4">
        {applicationChecks.map((text) => (
          <li key={text} className="flex gap-4">
            <span aria-hidden="true" className="mt-2 size-2 shrink-0 rounded-full bg-brand-500" />
            <p>{text}</p>
          </li>
        ))}
      </ul>
    </GuideCard>
  );
}
