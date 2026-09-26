const labels = ["О вас", "Опыт", "Планы"];

export default function StepIndicator({ step }: { step: number }) {
  return (
    <div>
      <p className="text-sm text-neutral-500" aria-live="polite">Шаг {step + 1} из 3</p>
      <ol className="relative mt-5 grid grid-cols-3 before:absolute before:inset-x-6 before:top-5 before:h-px before:bg-brand-200" aria-label="Этапы заявки">
        {labels.map((label, index) => (
          <li key={label} aria-current={step === index ? "step" : undefined} className="relative flex flex-col items-center gap-2">
            <span className={`flex size-10 items-center justify-center rounded-full text-sm font-semibold ${index <= step ? "bg-brand-500 text-white shadow-sm" : "bg-brand-100 text-neutral-500"}`}>{index < step ? "✓" : index + 1}</span>
            <span className={`text-xs ${index === step ? "font-medium text-brand-600" : "text-neutral-500"}`}>{label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
