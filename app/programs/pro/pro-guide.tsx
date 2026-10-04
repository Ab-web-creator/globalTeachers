import type { ReactNode } from "react";
import IconCard from "../../services/components/icon-card";
import CheckList from "../components/check-list";
import ProApproach from "./pro-approach";
import ProFit from "./pro-fit";
import ProgramSection from "../components/program-section";
import Prose from "../components/prose";
import StatCard from "../components/stat-card";
import { icons } from "../components/icons";
import { inclusions, practice, presentationProblems, problem, support } from "./content";

export default function ProGuide({ children }: { children?: ReactNode }) {
  return (
    <>
      <ProgramSection id="pro-problem" label="Почему нет приглашений" title="Причина не всегда в квалификации" fade="violet" aside={<CheckList items={presentationProblems} icon="alert" />}>
        <Prose paragraphs={problem.paragraphs} closing={problem.closing} />
      </ProgramSection>
      <ProgramSection id="pro-inclusions" label="Состав программы" title="Что входит в PRO" fade="sky">
        <ul className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {inclusions.map(({ icon, title, paragraphs }) => <IconCard key={title} icon={icons[icon]} title={title} paragraphs={paragraphs} />)}
        </ul>
      </ProgramSection>
      <ProApproach />
      <ProgramSection id="pro-practice" label="Практика и поддержка" title="Когда начинается настоящий поиск" fade="violet">
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-neutral-600">{practice.description}</p>
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {practice.inclusions.map(({ icon, title, paragraphs }) => <IconCard key={title} icon={icons[icon]} title={title} paragraphs={paragraphs} />)}
          <li>
            <StatCard value="30 дней" label="ответов на ваши вопросы" text={support.text} />
          </li>
        </ul>
      </ProgramSection>
      <div>
        <ProFit />
        {children && <div className="mt-16 sm:mt-20 lg:mt-24">{children}</div>}
      </div>
    </>
  );
}
