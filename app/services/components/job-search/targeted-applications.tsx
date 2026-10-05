import ProFitCard from "../../../programs/pro/pro-fit-card";
import { icons } from "../../../programs/components/icons";
import { applicationChecks, applicationChecksTakeaway, targetedApplicationsTakeaway } from "./content";

export default function TargetedApplications() {
  return (
    <ProFitCard headingLevel="h3" id="targeted-applications" title="Не отправляйте одно резюме всем подряд." icon={icons.target} note="Качество важнее количества" variant="application">
      <p>Работодатели за рубежом ценят персонализированные отклики. Покажите, что вы понимаете школу, её ценности и требования вакансии.</p>
      <p>Качество откликов всегда важнее их количества. Целевой подход повышает шансы на приглашение на собеседование.</p>
      <p className="border-t border-brand-200/60 pt-5 font-semibold text-brand-600">{targetedApplicationsTakeaway}</p>
    </ProFitCard>
  );
}

export function ApplicationChecks() {
  return (
    <ProFitCard headingLevel="h3" id="application-checks" title="Перед отправкой заявки посмотрите." icon={icons.checklist} note="Пять минут перед отправкой" variant="checklist">
      <ul className="space-y-2">
        {applicationChecks.map((text) => (
          <li key={text} className="flex gap-4">
            <span aria-hidden="true" className="mt-2 size-2 shrink-0 rounded-full bg-gray-300" />
            <p>{text}</p>
          </li>
        ))}
      </ul>
      <p className="border-t border-brand-200/60 pt-5 font-semibold text-brand-600">{applicationChecksTakeaway}</p>
    </ProFitCard>
  );
}
