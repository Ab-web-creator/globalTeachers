import { TierFeatureStarIcon } from "@/app/components/svg";
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
              {vip && <TierFeatureStarIcon />}
              {tier}
            </p>
            <p className={`mt-1 text-lg leading-snug ${vip ? "font-medium text-brand-950" : "text-neutral-600"}`}>{text}</p>
          </li>
        );
      })}
    </ol>
  );
}
