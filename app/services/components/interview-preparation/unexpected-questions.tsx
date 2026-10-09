import { InterviewNotesIllustration, InterviewQuestionIcon, interviewQuestionIcons } from "@/app/components/svg";
import SectionLabel from "../job-search/section-label";
import SectionHeading from "../section-heading";
import { interviewQuestions, unexpectedQuestionsIntroduction, unexpectedQuestionsTip } from "./content";

export default function UnexpectedQuestions() {
  return (
    <div className="relative isolate grid items-center gap-10 lg:grid-cols-3 lg:gap-12">
      <div className="lg:col-span-2">
        <SectionLabel>Сложные вопросы</SectionLabel>
        <SectionHeading id="unexpected-questions">Будьте готовы к неожиданным вопросам</SectionHeading>
        <p className="mt-7 max-w-2xl text-lg leading-relaxed text-neutral-600">{unexpectedQuestionsIntroduction}</p>
        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {interviewQuestions.map((question, index) => (<QuestionRow key={question} icon={interviewQuestionIcons[index]}>{question}</QuestionRow>))}
        </ul>
        <aside className="mt-8 border-l-2 border-brand-300 pl-4">
          <p className="text-lg font-medium leading-relaxed text-brand-600">
            <strong className="font-semibold">Совет:</strong> {unexpectedQuestionsTip}
          </p>
        </aside>
      </div>
      <div className="relative hidden self-stretch lg:block">
        <InterviewNotesIllustration />
      </div>
    </div>
  );
}

function QuestionRow({ icon, children }: {
  icon: (typeof interviewQuestionIcons)[number];
  children: string;
}) {
  return (
    <li className="flex items-center gap-4 rounded-2xl border border-brand-100 bg-white/70 px-3 py-3 sm:px-4">
      <span aria-hidden="true" className={`flex size-9 shrink-0 items-center justify-center rounded-full ${icon.tone}`}>
        <InterviewQuestionIcon path={icon.path} />
      </span>
      <span className="leading-snug text-md font-bold text-neutral-500">{children}</span>
    </li>
  );
}
