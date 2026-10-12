import SupportJourneyAnimation from "./support-journey-animation";
import ProgramSection from "../components/program-section";
import Prose from "../components/prose";
import { difference } from "./content";

export default function VipDifference() {
  return (
    <ProgramSection id="vip-difference" label="Отличие VIP" title={<>Не консультация<br />Не просто подготовка<br /><span className="text-brand-500">Сопровождение</span></>} asideClassName="max-sm:hidden" aside={<SupportJourneyAnimation />}>
      <Prose paragraphs={difference.paragraphs} />
      <p className="mt-6 max-w-lg border-l-2 border-brand-300 pl-4 text-lg font-semibold leading-relaxed text-brand-600">
        {difference.closing}
      </p>
    </ProgramSection>
  );
}
