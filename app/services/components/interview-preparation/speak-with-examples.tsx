import { InterviewAnswerIllustration } from "@/app/components/svg";
import SectionFade from "../cv-portfolio/section-fade";
import SectionLabel from "../job-search/section-label";
import SectionHeading from "../section-heading";
import AnswerExample from "./answer-example";
import { speakWithExamples } from "./content";
import ResearchTip from "./research-tip";

export default function SpeakWithExamples() {
  return (
    <section aria-labelledby="interview-examples" className="relative isolate grid items-center gap-10 lg:grid-cols-5 lg:gap-20 py-12 sm:py-16 lg:py-20">
      <SectionFade tone="violet" direction="down" toWhite halfHeight />
      <div className="hidden justify-items-center lg:col-span-2 lg:grid">
        <InterviewAnswerIllustration />
      </div>
      <div className="lg:col-span-3">
        <SectionLabel>Сильные ответы</SectionLabel>
        <SectionHeading id="interview-examples">Говорите примерами</SectionHeading>
        <p className="mt-7 text-lg leading-relaxed text-neutral-600">{speakWithExamples.intro}</p>
        <div className="mt-8">
          <AnswerExample label="Пример фразы">{speakWithExamples.weakPhrase}</AnswerExample>
        </div>
        <p className="mt-8 text-lg leading-relaxed text-neutral-600">{speakWithExamples.stepsIntro}</p>
        <div className="mt-5">
          <ExampleSteps steps={speakWithExamples.steps} />
        </div>
        <p className="mt-8 max-w-3xl text-lg leading-relaxed text-neutral-600">{speakWithExamples.outcome}</p>
        <div className="mt-8">
          <ResearchTip>{speakWithExamples.tip}</ResearchTip>
        </div>
      </div>
    </section>
  );
}

function ExampleSteps({ steps }: {
  steps: readonly string[];
}) {
  return (
    <ol className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-stretch">
      {steps.map((step, index) => (<li key={step} className="flex min-w-0 items-center gap-3 md:flex-1 md:basis-48">
        {index > 0 && <span aria-hidden="true" className="hidden shrink-0 text-xl text-brand-400 md:block">→</span>}
        <div className="flex min-w-0 flex-1 items-center gap-4 self-stretch rounded-2xl border border-brand-100 bg-white/70 p-4">
          <span aria-hidden="true" className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-100/70 text-lg font-medium tabular-nums text-brand-500">{String(index + 1).padStart(2, "0")}</span>
          <span className="min-w-0 wrap-break-word leading-snug text-neutral-600">{step}</span>
        </div>
      </li>))}
    </ol>
  );
}
