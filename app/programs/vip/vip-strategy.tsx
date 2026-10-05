import ProgramSection from "../components/program-section";
import StrategyMap from "./strategy-map";
import { strategy } from "./content";

export default function VipStrategy() {
  return (
    <ProgramSection id="vip-strategy" label="Стратегия" title={<>Сначала —<br /><span className="text-brand-500">стратегия</span></>} aside={<StrategyMap />}>
      {strategy.paragraphs.map((text) => (
        <p key={text} className="mt-6 max-w-lg text-lg leading-relaxed text-neutral-600">{text}</p>
      ))}
      <div className="mt-8 max-w-lg border-l-2 border-brand-300 pl-5">
        <p className="text-lg font-medium leading-relaxed text-brand-600">{strategy.closing}</p>
      </div>
    </ProgramSection>
  );
}
