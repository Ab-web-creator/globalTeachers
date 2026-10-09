import { programIconPaths } from "@/app/components/svg";
import IconCard from "../../services/components/icon-card";
import ProgramSection from "../components/program-section";
import QuestionCard from "../components/question-card";
import { cvQuestion, inclusions, inclusionsIntroduction } from "./content";

export default function ProInclusions() {
  return (
    <ProgramSection id="pro-inclusions" label="Состав программы" title="Что входит в PRO" fade="sky">
      <p className="mt-7 max-w-3xl text-lg leading-relaxed text-neutral-600">{inclusionsIntroduction}</p>
      <ul className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {inclusions.map(({ icon, title, paragraphs }) => <IconCard key={title} icon={programIconPaths[icon]} title={title} paragraphs={paragraphs} />)}
        <li>
          <QuestionCard lead={cvQuestion.lead} question={cvQuestion.question} />
        </li>
      </ul>
    </ProgramSection>
  );
}
