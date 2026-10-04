import FlowChips from "../../services/components/flow-chips";

// A card that spells out a "a → b → c" sequence as connected chips.
export default function FlowCard({ title, flow }: { title: string; flow: string }) {
  return (
    <div className="rounded-3xl border border-brand-100 bg-white/80 p-6 sm:p-8">
      <p className="mb-5 text-lg font-semibold text-brand-950">{title}</p>
      <FlowChips text={flow} />
    </div>
  );
}
