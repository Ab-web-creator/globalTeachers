export default function ExampleSteps({ steps }: { steps: readonly string[] }) {
  return (
    <ol className="flex flex-col gap-3 md:flex-row md:items-stretch">
      {steps.map((step, index) => (
        <li key={step} className="flex items-center gap-3 md:flex-1">
          {index > 0 && <span aria-hidden="true" className="hidden shrink-0 text-xl text-brand-400 md:block">→</span>}
          <div className="flex flex-1 items-center gap-4 self-stretch rounded-2xl border border-brand-100 bg-white/70 p-4">
            <span aria-hidden="true" className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-100/70 text-lg font-medium tabular-nums text-brand-500">{String(index + 1).padStart(2, "0")}</span>
            <span className="leading-snug text-neutral-600">{step}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}
