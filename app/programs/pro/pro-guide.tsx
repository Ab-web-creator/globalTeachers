import type { ReactNode } from "react";
import IconCard from "../../services/components/icon-card";
import CheckList from "../components/check-list";
import ProApproach from "./pro-approach";
import ProFit from "./pro-fit";
import ProgramSection from "../components/program-section";
import QuestionCard from "../components/question-card";
import Prose from "../components/prose";
import StatCard from "../components/stat-card";
import { icons } from "../components/icons";
import { cvQuestion, inclusions, inclusionsIntroduction, practice, presentationProblems, problem } from "./content";

export default function ProGuide({ children }: { children?: ReactNode }) {
  return (
    <>
      <ProgramSection id="pro-problem" label="Почему нет приглашений" title="Причина не всегда в квалификации" fade="violet" aside={<CheckList items={presentationProblems} icon="alert" />} asideAlign="end">
        <Prose paragraphs={problem.paragraphs} closing={problem.closing} />
      </ProgramSection>
      <ProgramSection id="pro-inclusions" label="Состав программы" title="Что входит в PRO" fade="sky">
        <p className="mt-7 max-w-3xl text-lg leading-relaxed text-neutral-600">{inclusionsIntroduction}</p>
        <ul className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {inclusions.map(({ icon, title, paragraphs }) => <IconCard key={title} icon={icons[icon]} title={title} paragraphs={paragraphs} />)}
          <li>
            <QuestionCard lead={cvQuestion.lead} question={cvQuestion.question} />
          </li>
        </ul>
      </ProgramSection>
      <ProApproach />
      <div>
        <div>
          <ProgramSection id="pro-practice" label="Практика и поддержка" title="Когда начинается настоящий поиск">
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 bg-linear-to-b from-sky-100 via-cyan-50/50 via-20% to-sky-100/0 to-50%" />
            <p className="mt-7 max-w-3xl text-lg leading-relaxed text-neutral-600">{practice.description}</p>
            <ul className="mt-10 grid gap-4 md:grid-cols-2">
              {practice.inclusions.map(({ icon, title, paragraphs }) => (
                <IconCard
                  key={title}
                  icon={icons[icon]}
                  title={title}
                  paragraphs={paragraphs}
                  surface="border-brand-100 bg-white hover:border-brand-300/60 hover:bg-brand-300/10"
                  tone="bg-brand-300/15 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white"
                />
              ))}
              <li>
                  <StatCard value="30 дней" label="ответов на ваши вопросы" />
              </li>
            </ul>
          </ProgramSection>
        </div>
        <div className="relative isolate">
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 bg-linear-to-b from-sky-50 via-brand-100/40 via-20% to-white to-70%" />
          <ProFit />
          {children && <div className="pb-12 sm:pb-0">{children}</div>}
        </div>
      </div>
    </>
  );
}
