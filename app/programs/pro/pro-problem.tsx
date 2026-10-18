"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import AnimatedCheckList from "../components/animated-check-list";
import ProgramSection from "../components/program-section";
import Prose from "../components/prose";
import { presentationProblems, problem } from "./content";

export default function ProProblem() {
  const t = useTranslations();
  return (
    <ProgramSection id="pro-problem" label={t("programs.pro.proProblem.message1183")} title={t("programs.pro.proProblem.message1184")} fade="violet" aside={<div className="text-lg"><AnimatedCheckList items={presentationProblems} icon="alert" /></div>} asideAlign="end">
      <Prose paragraphs={problem.paragraphs} />
      <p className="mt-5 border-l-2 border-brand-300 pl-4 text-lg font-medium leading-relaxed text-brand-600">{t.content(problem.closing)}</p>
    </ProgramSection>
  );
}
