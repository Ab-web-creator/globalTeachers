import type { ReactNode } from "react";
import AnimatedQuestions from "./animated-questions";
import StartOutcomes from "./start-outcomes";
import StartInclusions from "./start-inclusions";
import IconPanel from "../../services/components/cv-portfolio/icon-panel";
import ProgramSection from "../components/program-section";
import { approach, audience } from "./content";

export default function StartGuide({ children }: { children?: ReactNode }) {
  return (
    <>
      <div>
        <div>
          <ProgramSection id="start-questions" label="Знакомо?" title="Хотите начать, но есть вопросы?">
            <p className="mt-7 max-w-3xl text-lg leading-relaxed text-neutral-600">Вы хотите работать в международной школе, но пока не уверены, с чего начать. Возможно, вас волнуют такие вопросы:</p>
            <div className="mt-10 text-lg">
              <AnimatedQuestions />
            </div>
          </ProgramSection>
        </div>
        <section aria-labelledby="start-approach start-audience" className="relative left-1/2 w-screen -translate-x-1/2 bg-linear-to-r from-blue-50 to-violet-100 py-12 sm:py-16 lg:py-20">
          <div className="mx-auto grid max-w-400 gap-6 px-6 sm:px-10 lg:grid-cols-2 lg:px-16 xl:px-20">
            <IconPanel as="div" id="start-approach" title="Именно для этого создан START" icon="checklist" tone="white">
              {approach.paragraphs.map((text) => <p key={text} className="mt-4 text-lg leading-relaxed text-neutral-600">{text}</p>)}
            </IconPanel>
            <IconPanel as="div" id="start-audience" title="Кому подходит START?" icon="handshake" tone="white">
              {audience.paragraphs.map((text) => <p key={text} className="mt-4 max-w-lg text-lg leading-relaxed text-neutral-600">{text}</p>)}
              <p className="mt-6 text-lg font-medium leading-relaxed text-brand-600">{audience.note}</p>
            </IconPanel>
          </div>
        </section>
      </div>
      <StartOutcomes flow={approach.outcome} />
      <ProgramSection id="start-inclusions" label="Состав программы" title="Что входит в START" fade="violet" fadeDirection="down" fadeQuarterHeight>
        <p className="mt-7 max-w-3xl text-lg leading-relaxed text-neutral-600">Всё необходимое для уверенного старта: оценка вашего опыта, ответы на ключевые вопросы и пошаговый план самостоятельного поиска работы.</p>
        <StartInclusions />
      </ProgramSection>
      {children && <div className="pb-12 sm:pb-0">{children}</div>}
    </>
  );
}
