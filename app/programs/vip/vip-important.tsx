import ProgramSection from "../components/program-section";
import Prose from "../components/prose";
import { important } from "./content";

export default function VipImportant() {
  return (
    <ProgramSection id="vip-important" label="Честно о главном" title="Важно">
      <div className="max-w-2xl">
        <Prose paragraphs={important.paragraphs} closing={important.closing} />
        <p className="mt-6 border-l-2 border-brand-300 pl-4 text-lg font-medium leading-relaxed text-brand-600">{important.note}</p>
      </div>
    </ProgramSection>
  );
}
