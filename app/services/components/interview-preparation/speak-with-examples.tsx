import SectionHeading from "../section-heading";
import SectionLabel from "../job-search/section-label";
import SectionFade from "../cv-portfolio/section-fade";
import AnswerExample from "./answer-example";
import ExampleSteps from "./example-steps";
import HandwrittenNote from "./handwritten-note";
import ResearchTip from "./research-tip";
import { speakWithExamples } from "./content";

export default function SpeakWithExamples() {
  return (
    <section aria-labelledby="interview-examples" className="relative isolate grid items-center gap-10 pb-12 sm:pb-16 lg:grid-cols-5 lg:gap-20 lg:pb-20">
      <SectionFade tone="rose" />
      <div className="hidden justify-items-center lg:col-span-2 lg:grid">
        <HandwrittenNote>{speakWithExamples.note}</HandwrittenNote>
      </div>
      <div className="lg:col-span-3">
        <SectionLabel>Сильные ответы</SectionLabel>
        <SectionHeading id="interview-examples">Говорите примерами</SectionHeading>
        <p className="mt-5 text-lg leading-relaxed text-neutral-600">{speakWithExamples.intro}</p>
        <div className="mt-5">
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
