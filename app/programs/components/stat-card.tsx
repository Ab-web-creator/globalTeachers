import HighlightCard from "./highlight-card";

// A highlighted card led by one big figure, e.g. a support period.
export default function StatCard({ value, label, text }: { value: string; label: string; text: string }) {
  return (
    <HighlightCard>
      <div className="rounded-2xl border border-brand-300 px-4 py-5 text-center">
        <p className="text-5xl font-semibold tracking-tight text-brand-500">{value}</p>
        <p className="mt-2 text-lg font-semibold text-brand-950">{label}</p>
      </div>
      <p className="mt-4 leading-relaxed text-neutral-600">{text}</p>
    </HighlightCard>
  );
}
