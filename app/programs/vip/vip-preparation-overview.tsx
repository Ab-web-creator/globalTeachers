import IconList from "../components/icon-list";
import { iconTones } from "../components/icon-tones";
import ProgramSection from "../components/program-section";
import { preparation } from "./content";

export default function VipPreparationOverview() {
  return (
    <div className="relative isolate">
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 bg-violet-50" />
      <ProgramSection id="vip-preparation" label="Подготовка" title="Потом полная профессиональная подготовка">
        <p className="mt-7 text-lg leading-relaxed text-neutral-600">
          {preparation.paragraphs[0]}
        </p>
        <h3 className="mt-4 text-lg font-semibold leading-relaxed text-brand-950">Мы готовим:</h3>
        <IconList items={preparation.items.map((item, index) => ({ ...item, tone: iconTones[index] }))} cards />
        <p className="mt-10 max-w-lg border-l-2 border-brand-300 pl-5 text-lg leading-relaxed text-brand-600 sm:mt-12">
          {preparation.paragraphs[1]}{" "}
          <strong className="font-semibold text-brand-600">{preparation.closing}</strong>
        </p>
      </ProgramSection>
    </div>
  );
}
