import { consultationSteps } from "./consultation-steps";

export default function StepIndicator({ step }: { step: number }) {
  return (
    <div>
      <p className="text-sm text-neutral-500" aria-live="polite">Шаг {step + 1} из {consultationSteps.length}</p>
      {step === 0 && <p className="mt-3 text-base leading-relaxed text-slate-600 lg:hidden">Оставьте заявку на консультацию — вместе определим ваш следующий шаг к работе в международной школе.</p>}
      <ol className="mt-4 flex gap-2" aria-label="Этапы заявки">
        {consultationSteps.map(({ title }, index) => (
          <li key={title} aria-current={step === index ? "step" : undefined} className={`h-2 flex-1 rounded-full ${index <= step ? "bg-brand-500" : "bg-brand-100"}`}>
            <span className="sr-only">{index + 1}. {title}{index < step ? " — завершён" : ""}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
