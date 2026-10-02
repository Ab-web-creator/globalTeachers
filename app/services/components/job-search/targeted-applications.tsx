import { applicationChecks } from "./content";

export default function TargetedApplications() {
  return (
    <section aria-labelledby="targeted-applications">
      <div className="max-w-[65ch]">
        <h2 id="targeted-applications" className="text-2xl font-semibold tracking-tight sm:text-3xl">Не отправляйте одно резюме всем подряд</h2>
        <p className="mt-4 leading-relaxed text-neutral-600">Количество откликов само по себе не увеличивает шансы получить работу.</p>
        <p className="mt-4 leading-relaxed text-neutral-600">Лучше отправить несколько хорошо подготовленных заявок на подходящие позиции, чем десятки одинаковых откликов.</p>
      </div>
    </section>
  );
}

export function ApplicationChecks() {
  return (
    <section aria-labelledby="application-checks">
      <h2 id="application-checks" className="text-2xl font-semibold tracking-tight sm:text-3xl">Перед отправкой заявки посмотрите</h2>
      <ul className="mt-7 space-y-4">
        {applicationChecks.map((text) => (
          <li key={text} className="flex gap-4">
            <span aria-hidden="true" className="mt-2 size-2 shrink-0 rounded-full bg-brand-500" />
            <p className="text-sm leading-relaxed text-neutral-600">{text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
