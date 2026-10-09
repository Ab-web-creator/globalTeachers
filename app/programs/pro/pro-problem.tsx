import AnimatedCheckList from "../components/animated-check-list";
import ProgramSection from "../components/program-section";
import Prose from "../components/prose";
import { presentationProblems, problem } from "./content";

export default function ProProblem() {
  return (
    <ProgramSection id="pro-problem" label="Почему нет приглашений" title="Причина не всегда в квалификации" fade="violet" aside={<div className="text-lg"><AnimatedCheckList items={presentationProblems} icon="alert" /></div>} asideAlign="end">
      <Prose paragraphs={problem.paragraphs} />
      <p className="mt-5 border-l-2 border-brand-300 pl-4 text-lg font-medium leading-relaxed text-brand-600">{problem.closing}</p>
    </ProgramSection>
  );
}
