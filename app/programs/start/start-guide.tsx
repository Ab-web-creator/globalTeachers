import type { ReactNode } from "react";
import IconCard from "../../services/components/icon-card";
import CheckList from "../components/check-list";
import StartOutcomes from "./start-outcomes";
import IconPanel from "../../services/components/cv-portfolio/icon-panel";
import ProgramSection from "../components/program-section";
import { icons } from "../components/icons";
import { approach, audience, inclusions, questions } from "./content";

export default function StartGuide({ children }: { children?: ReactNode }) {
  return (
    <>
      <div>
        <div className="pb-12 sm:pb-16 lg:pb-20">
          <ProgramSection id="start-questions" label="Знакомо?" title="Вы хотите работать в международной школе, но пока не уверены:">
            <div className="mt-8">
              <CheckList items={questions} icon="question" columns />
            </div>
          </ProgramSection>
        </div>
        <div className="relative left-1/2 w-screen -translate-x-1/2 bg-linear-to-r from-blue-50 to-violet-100">
          <div className="mx-auto grid max-w-400 gap-6 px-6 py-12 sm:px-10 sm:py-16 lg:grid-cols-2 lg:px-16 lg:py-20 xl:px-20">
            <IconPanel id="start-approach" title="Именно для этого создан START" icon="checklist">
              {approach.paragraphs.map((text) => <p key={text} className="mt-4 leading-relaxed text-neutral-600">{text}</p>)}
            </IconPanel>
            <IconPanel id="start-audience" title="Кому подходит START?" icon="handshake">
              {audience.paragraphs.map((text) => <p key={text} className="mt-4 max-w-lg leading-relaxed text-neutral-600">{text}</p>)}
              <p className="mt-6 text-base font-medium leading-relaxed text-brand-600">{audience.note}</p>
            </IconPanel>
          </div>
        </div>
      </div>
      <StartOutcomes flow={approach.outcome} />
      <ProgramSection id="start-inclusions" label="Состав программы" title="Что входит в START" fade="violet" fadeDirection="down">
        <ul className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {inclusions.map(({ icon, title, text }) => <IconCard key={title} icon={icons[icon]} title={title} paragraphs={[text]} />)}
        </ul>
        {children && <div className="mt-12 sm:mt-16 lg:mt-20">{children}</div>}
      </ProgramSection>
    </>
  );
}
