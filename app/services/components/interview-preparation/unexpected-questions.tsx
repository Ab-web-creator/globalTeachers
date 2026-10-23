"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import { InterviewQuestionIcon, interviewQuestionIcons } from "@/app/components/svg";
import SectionLabel from "../job-search/section-label";
import SectionHeading from "../section-heading";
import { interviewQuestions, unexpectedQuestionsIntroduction, unexpectedQuestionsTip } from "./content";

export default function UnexpectedQuestions() {
  const t = useTranslations();
  return (
    <div className="relative isolate">
      <div>
        <SectionLabel>{t("services.interviewPreparation.unexpectedQuestions.message1640")}</SectionLabel>
        <SectionHeading id="unexpected-questions">{t("services.interviewPreparation.unexpectedQuestions.message1641")}</SectionHeading>
        <p className="mt-7 max-w-2xl text-lg leading-relaxed text-neutral-600">{t.content(unexpectedQuestionsIntroduction)}</p>
        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {interviewQuestions.map((question, index) => (<QuestionRow key={question} icon={interviewQuestionIcons[index]}>{t.content(question)}</QuestionRow>))}
        </ul>
        <aside className="mt-8 border-l-2 border-brand-300 pl-4">
          <p className="max-w-[65ch] text-lg font-medium leading-relaxed text-brand-600">
            <strong className="font-semibold">{t("services.interviewPreparation.researchTip.message1631")}</strong> {t.content(unexpectedQuestionsTip)}
          </p>
        </aside>
      </div>
    </div>
  );
}

function QuestionRow({ icon, children }: {
  icon: (typeof interviewQuestionIcons)[number];
  children: string;
}) {
  const t = useTranslations();
  return (
    <li className="flex items-center gap-4 rounded-2xl border border-brand-100 bg-white/70 px-3 py-3 sm:px-4">
      <span aria-hidden="true" className={`flex size-9 shrink-0 items-center justify-center rounded-full ${icon.tone}`}>
        <InterviewQuestionIcon path={icon.path} />
      </span>
      <span className="text-base font-normal leading-snug text-neutral-600 lg:text-lg">{t.content(children)}</span>
    </li>
  );
}
