export default function FlowChips({ text }: { text: string }) {
  const steps = text.replace(/\.$/, "").split("→").map((step) => step.trim());

  return (
    <ol aria-label={text} className="flex flex-wrap items-center gap-2">
      {steps.map((step, index) => (
        <li key={step} className="flex items-center gap-2">
          {index > 0 && <span aria-hidden="true" className="text-brand-400">→</span>}
          <span className="rounded-full bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-600">{step}</span>
        </li>
      ))}
    </ol>
  );
}
