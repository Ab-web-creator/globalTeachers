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
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-neutral-600">{inclusionsIntroduction}</p>
        <ul className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {inclusions.map(({ icon, title, paragraphs }) => <IconCard key={title} icon={icons[icon]} title={title} paragraphs={paragraphs} />)}
          <li>
            <QuestionCard lead={cvQuestion.lead} question={cvQuestion.question} />
          </li>
        </ul>
      </ProgramSection>
      <ProApproach />
      <div>
        <div className="pb-12 sm:pb-16 lg:pb-20">
          <ProgramSection id="pro-practice" label="Практика и поддержка" title="Когда начинается настоящий поиск">
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-neutral-600">{practice.description}</p>
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
        <div className="relative isolate pt-12 sm:pt-16 lg:pt-20">
          <div aria-hidden="true" className="pointer-events-none absolute top-0 -bottom-12 left-1/2 -z-10 w-screen -translate-x-1/2 bg-linear-to-r from-sky-50/60 via-brand-100/40 to-sky-50/60 sm:-bottom-16 lg:-bottom-20" />
          <ProFit />
          {children && <div className="mt-16 sm:mt-20 lg:mt-20">{children}</div>}
        </div>
      </div>
    </>
  );
}
