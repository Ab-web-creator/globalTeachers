import { difference } from "./content";

// START → PRO → VIP stacked, with VIP highlighted.
export default function TierCompare() {
  return (
    <ol className="grid max-w-md gap-3">
      {difference.tiers.map(({ tier, text }) => {
        const vip = tier === "VIP";
        return (
          <li key={tier} className={`rounded-2xl px-6 py-4 ${vip ? "border border-brand-300 bg-linear-to-br from-violet-100 via-white to-brand-100 shadow-xl shadow-brand-500/15" : "border border-brand-100 bg-white"}`}>
            <p className={`flex items-center gap-1.5 text-sm font-semibold tracking-widest ${vip ? "text-amber-600" : "text-brand-500"}`}>
              {vip && <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-4"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z" /></svg>}
              {tier}
            </p>
            <p className={`mt-1 text-lg leading-snug ${vip ? "font-medium text-brand-950" : "text-neutral-600"}`}>{text}</p>
          </li>
        );
      })}
    </ol>
  );
}
