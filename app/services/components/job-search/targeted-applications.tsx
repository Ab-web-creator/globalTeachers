import { applicationChecks } from "./content";
import GuideIcon from "./guide-icon";

export default function TargetedApplications() {
  return (
    <section aria-labelledby="targeted-applications" className="grid gap-8 rounded-3xl bg-linear-to-br from-accent-50 to-accent-50/40 p-6 sm:p-10 lg:grid-cols-2 lg:items-center lg:gap-12">
      <div>
        <h2 id="targeted-applications" className="text-2xl font-semibold tracking-tight sm:text-3xl">Не отправляйте одно резюме всем подряд</h2>
        <p className="mt-4 leading-relaxed text-neutral-600">Количество откликов само по себе не увеличивает шансы получить работу.</p>
        <p className="mt-4 leading-relaxed text-neutral-600">Лучше отправить несколько хорошо подготовленных заявок на подходящие позиции, чем десятки одинаковых откликов.</p>
      </div>
      <div className="rounded-2xl border border-accent-100/60 bg-white/90 p-6 shadow-sm sm:p-7">
        <p className="mb-5 leading-relaxed text-neutral-600">Перед отправкой заявки посмотрите:</p>
        <ul className="space-y-4">
          {applicationChecks.map((text) => <li key={text} className="flex items-start gap-3 text-sm leading-relaxed text-neutral-600"><span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-600 text-white"><GuideIcon name="check" className="size-3.5" /></span>{text}</li>)}
        </ul>
      </div>
    </section>
  );
}
