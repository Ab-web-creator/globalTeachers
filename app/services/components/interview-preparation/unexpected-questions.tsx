import SectionHeading from "../section-heading";
import SectionLabel from "../job-search/section-label";
import QuestionRow from "./question-row";
import ResearchTip from "./research-tip";
import { interviewQuestions, unexpectedQuestionsIntroduction, unexpectedQuestionsTip } from "./content";
import { questionIcons } from "./question-icons";

export default function UnexpectedQuestions() {
  return (
    <div className="relative isolate grid items-center gap-10 lg:grid-cols-3 lg:gap-12">
      <div className="lg:col-span-2">
        <SectionLabel>Сложные вопросы</SectionLabel>
        <SectionHeading id="unexpected-questions">Будьте готовы к неожиданным вопросам</SectionHeading>
        <p className="mt-7 max-w-2xl text-lg leading-relaxed text-neutral-600">{unexpectedQuestionsIntroduction}</p>
        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {interviewQuestions.map((question, index) => (
            <QuestionRow key={question} icon={questionIcons[index]}>{question}</QuestionRow>
          ))}
        </ul>
        <div className="mt-8">
          <ResearchTip>{unexpectedQuestionsTip}</ResearchTip>
        </div>
      </div>
      <div className="relative hidden self-stretch lg:block">
        <svg aria-hidden="true" viewBox="0 88 1024 1380" preserveAspectRatio="xMidYMax meet" className="absolute inset-0 h-full w-full">
          <image href="/images/interview-notes-cutout.webp" width="1024" height="1536" style={{ maskImage: "url(/images/interview-notes-mask.svg)", maskSize: "100% 100%", maskRepeat: "no-repeat" }} />
        </svg>
      </div>
    </div>
  );
}
