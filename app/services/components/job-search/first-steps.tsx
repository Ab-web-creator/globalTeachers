import { JobSearchStepIcon, jobSearchStepPaths, StepConnectorArrowIcon } from "@/app/components/svg";
import type { ReactNode } from "react";
import SectionHeading from "../section-heading";
import { firstSteps, firstStepsIntroduction, firstStepsOutcome } from "./content";
import SectionLabel from "./section-label";

const stepAccents = [
  { icon: "target", badge: "bg-violet-100 text-violet-600", circle: "bg-violet-50 text-violet-600", bar: "border-violet-200" },
  { icon: "map", badge: "bg-sky-100 text-sky-600", circle: "bg-sky-50 text-sky-600", bar: "border-sky-200" },
  { icon: "document", badge: "bg-emerald-100 text-emerald-600", circle: "bg-emerald-50 text-emerald-600", bar: "border-emerald-200" },
  { icon: "laptop", badge: "bg-amber-100 text-amber-600", circle: "bg-amber-50 text-amber-500", bar: "border-amber-200" },
  { icon: "bell", badge: "bg-pink-100 text-pink-600", circle: "bg-pink-50 text-pink-600", bar: "border-pink-200" },
] as const;

type Accent = (typeof stepAccents)[number];

export default function FirstSteps({ children }: {
  children?: ReactNode;
}) {
  return (
    <section aria-labelledby="job-search-first-steps" className="py-12 sm:py-16 lg:py-20">
      <SectionLabel>Первые шаги</SectionLabel>
      <div className="flex flex-col gap-7">
        <SectionHeading id="job-search-first-steps">С чего начать?</SectionHeading>
        <div className="max-w-3xl text-lg leading-relaxed text-neutral-600">
          <p>{firstStepsIntroduction}</p>
          <p className="mt-4">{firstStepsOutcome}</p>
        </div>
      </div>
      <div className="mt-10 lg:-mx-4 lg:mt-4 lg:overflow-x-auto lg:px-4 lg:pt-6 lg:pb-4">
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-[repeat(4,minmax(13rem,1fr)_auto)_minmax(13rem,1fr)] lg:gap-3">
          {firstSteps.map(({ title, text }, index) => (<li key={title} className="lg:contents">
            <StepCard number={index + 1} title={title} text={text} accent={stepAccents[index]} />
            {index < firstSteps.length - 1 && <StepConnector />}
          </li>))}
        </ol>
      </div>
      {children && <div className="mt-16 sm:mt-20">{children}</div>}
    </section>
  );
}

function StepCard({ number, title, text, accent }: {
  number: number;
  title: string;
  text: string;
  accent: Accent;
}) {
  return (
    <div className="relative flex h-full gap-4 overflow-hidden rounded-3xl bg-white p-5 pb-7 shadow-card shadow-neutral-300/60 ring-1 ring-neutral-100 sm:flex-col sm:gap-0">
      <div className="flex shrink-0 items-start gap-3">
        <span className={`flex size-10 shrink-0 items-center justify-center rounded-full text-lg font-bold sm:bg-neutral-100 sm:text-neutral-500 ${accent.badge}`}>{number}</span>
        <span className={`hidden size-20 items-center justify-center rounded-full sm:flex ${accent.circle}`}>
          <JobSearchStepIcon path={jobSearchStepPaths[accent.icon]} />
        </span>
      </div>
      <div className="min-w-0 sm:mt-5">
        <p className="text-base font-bold leading-snug text-neutral-900">{title}</p>
        <p className="mt-3 text-sm leading-relaxed text-neutral-500">{text}</p>
      </div>
      <span aria-hidden="true" className={`pointer-events-none absolute inset-0 rounded-3xl border-r-6 border-b-6 ${accent.bar}`} />
    </div>
  );
}

function StepConnector() {
  return (
    <span aria-hidden="true" className="hidden items-center lg:flex">
      <span className="flex size-9 items-center justify-center rounded-full bg-sky-500 text-white shadow-md shadow-sky-200">
        <StepConnectorArrowIcon />
      </span>
    </span>
  );
}
