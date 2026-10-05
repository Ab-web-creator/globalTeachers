// Turns "a → b → c." into numbered tiles in two columns.
export default function NumberedSteps({ flow }: { flow: string }) {
  const steps = flow.replace(/\.$/, "").split("→").map((text) => text.trim());

  return (
    <ol className="mt-10 grid gap-3 sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-3">
      {steps.map((text, index) => (
        <li key={text} className="flex min-w-0 items-center gap-3 rounded-xl border border-brand-200 bg-white/80 p-4">
          <span aria-hidden="true" className="text-sm font-semibold tabular-nums text-brand-500">{String(index + 1).padStart(2, "0")}</span>
          <span className="text-base font-medium leading-snug text-brand-950">{text}</span>
        </li>
      ))}
    </ol>
  );
}
