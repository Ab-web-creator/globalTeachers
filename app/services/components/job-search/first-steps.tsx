import SectionHeading from "../section-heading";
import SectionLabel from "./section-label";
import StepCard, { StepConnector, stepAccents } from "./step-card";

import type { ReactNode } from "react";
import { firstSteps, firstStepsIntroduction } from "./content";

export default function FirstSteps({ children }: { children?: ReactNode }) {
  return (
    <section aria-labelledby="job-search-first-steps" className="py-12 sm:py-16 lg:py-20">
      <SectionLabel>Первые шаги</SectionLabel>
      <div className="flex flex-col gap-7">
        <SectionHeading id="job-search-first-steps">С чего начать?</SectionHeading>
        <p className="max-w-3xl text-lg leading-relaxed text-neutral-600">{firstStepsIntroduction}</p>
      </div>
      <div className="mt-10 lg:-mx-4 lg:mt-4 lg:overflow-x-auto lg:px-4 lg:pt-6 lg:pb-4">
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-[repeat(4,minmax(13rem,1fr)_auto)_minmax(13rem,1fr)] lg:gap-3">
          {firstSteps.map(({ title, text }, index) => (
            <li key={title} className="lg:contents">
              <StepCard number={index + 1} title={title} text={text} accent={stepAccents[index]} />
              {index < firstSteps.length - 1 && <StepConnector />}
            </li>
          ))}
        </ol>
      </div>
      {children && <div className="mt-16 sm:mt-20">{children}</div>}
    </section>
  );
}
