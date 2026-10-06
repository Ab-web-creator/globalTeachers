import SectionHeading from "../section-heading";
import SectionLabel from "../job-search/section-label";
import SectionFade from "../cv-portfolio/section-fade";
import AnswerExample from "./answer-example";
import ExampleSteps from "./example-steps";
import ExampleIllustration from "./example-illustration";
import ResearchTip from "./research-tip";
import { speakWithExamples } from "./content";

export default function SpeakWithExamples() {
  return (
    <section aria-labelledby="interview-examples" className="relative isolate grid items-center gap-10 lg:grid-cols-5 lg:gap-20 py-12 sm:py-16 lg:py-20">
      <SectionFade tone="violet" direction="down" toWhite halfHeight />
      <div className="hidden justify-items-center lg:col-span-2 lg:grid">
        <ExampleIllustration />
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
