import PageTitle from "../page-title";
import SectionLabel from "../job-search/section-label";
import ServiceHero from "../service-hero";
import { introduction } from "./content";
import InterviewPractice from "./interview-practice";
import InterviewTopics from "./interview-topics";
import SchoolResearch from "./school-research";
import SpeakWithExamples from "./speak-with-examples";
import UnexpectedQuestions from "./unexpected-questions";
import InterviewSupport from "./interview-support";
import SectionFade from "../cv-portfolio/section-fade";

export default function InterviewPreparationDetails() {
  return (
    <main className="mx-auto max-w-400 px-6 pt-6 pb-12 sm:px-10 sm:pb-16 lg:px-16 lg:pt-0 lg:pb-20 xl:px-20">
      <article>
        <ServiceHero image="/images/interview-preparation-hero.webp" imageAspectRatio="160000 / 116603" imageHeightScale={0.95}>
          <SectionLabel>Подготовка к интервью</SectionLabel>
          <PageTitle>Что вас ждёт на собеседовании?</PageTitle>
          <div className="mt-7 space-y-5">
            {introduction.map((text) => <p key={text} className="text-base leading-relaxed text-neutral-600 sm:text-lg">{text}</p>)}
          </div>
          <p className="mt-5 border-l-2 border-brand-300 pl-4 text-lg font-medium leading-relaxed text-brand-600">Успешное собеседование — это всегда диалог, а не экзамен.</p>
        </ServiceHero>
        <div>
          <InterviewTopics />
        </div>
        <SchoolResearch />
        <SpeakWithExamples />
        <section aria-labelledby="unexpected-questions" className="relative isolate py-12 sm:py-16 lg:py-20">
          <SectionFade direction="down" halfHeight />
          <UnexpectedQuestions />
          <div className="mt-12 sm:mt-16 lg:mt-20">
            <InterviewPractice />
          </div>
        </section>
        <InterviewSupport />
      </article>
    </main>
  );
}
