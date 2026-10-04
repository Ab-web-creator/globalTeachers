import Image from "next/image";
import SectionHeading from "../section-heading";
import SectionLabel from "../job-search/section-label";
import QuestionRow from "./question-row";
import ResearchTip from "./research-tip";
import { interviewQuestions, unexpectedQuestionsIntroduction, unexpectedQuestionsTip } from "./content";
import { questionIcons } from "./question-icons";

export default function UnexpectedQuestions() {
  return (
    <section aria-labelledby="unexpected-questions" className="grid items-center gap-10 lg:grid-cols-3 lg:gap-12">
      <div className="lg:col-span-2">
        <SectionLabel>Сложные вопросы</SectionLabel>
        <SectionHeading id="unexpected-questions">Будьте готовы к неожиданным вопросам</SectionHeading>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-neutral-600">{unexpectedQuestionsIntroduction}</p>
        <ul className="mt-5 grid gap-2 md:grid-cols-2">
          {interviewQuestions.map((question, index) => (
            <QuestionRow key={question} icon={questionIcons[index]}>{question}</QuestionRow>
          ))}
        </ul>
        <div className="mt-8">
          <ResearchTip>{unexpectedQuestionsTip}</ResearchTip>
        </div>
      </div>
      <div className="relative hidden self-stretch lg:block">
        <Image src="/images/interview-notes.png" alt="" width={688} height={1206} sizes="384px" className="absolute inset-y-0 left-1/2 h-full w-auto max-w-none -translate-x-1/2 mask-t-from-92% mask-r-from-88% mask-b-from-92% mask-l-from-88%" />
      </div>
    </section>
  );
}
