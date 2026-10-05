import IconList from "../components/icon-list";
import { iconTones } from "../components/icon-tones";
import type { IconName } from "../components/icons";
import ProgramSection from "../components/program-section";
import { strategy } from "./content";

const strategyIcons: IconName[] = ["globe", "school", "target", "calendar", "document", "profile"];

export default function VipStrategy() {
  return (
    <ProgramSection id="vip-strategy" label="Стратегия" title={<>Сначала — <span className="text-brand-500">стратегия</span></>}>
      {strategy.paragraphs.map((text) => (
        <p key={text} className="mt-4 max-w-lg text-lg leading-relaxed text-neutral-600">{text}</p>
      ))}
      <h3 className="mt-4 text-lg font-semibold leading-relaxed text-brand-950">Определяем вместе:</h3>
      <IconList items={strategy.items.map((label, index) => ({
        label: label.replace(/[;.]$/, ""),
        icon: strategyIcons[index],
        tone: iconTones[index],
      }))} cards outlined />
      <p className="mt-10 max-w-lg border-l-2 border-brand-300 pl-5 text-lg font-semibold leading-relaxed text-brand-600 sm:mt-12">
        {strategy.closing}
      </p>
    </ProgramSection>
  );
}
