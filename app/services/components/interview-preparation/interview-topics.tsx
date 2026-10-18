"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import { interviewQuestionIcons, InterviewTopicIcon, interviewTopicPaths } from "@/app/components/svg";
import SectionLabel from "../job-search/section-label";
import SectionHeading from "../section-heading";
import { interviewTopics, interviewTopicsIntroduction, interviewTopicsTakeaway } from "./content";
import ResearchTip from "./research-tip";

export default function InterviewTopics() {
  const t = useTranslations();
  return (
    <section aria-labelledby="interview-topics" className="relative isolate bg-white py-12 sm:py-16 lg:py-20">
      <SectionLabel>{t("services.interviewPreparation.interviewTopics.message1629")}</SectionLabel>
      <SectionHeading id="interview-topics">{t("services.interviewPreparation.interviewTopics.message1630")}</SectionHeading>
      <p className="mt-7 max-w-[63ch] text-lg leading-relaxed text-neutral-600">{t.content(interviewTopicsIntroduction)}</p>
      <ul className="mt-10 grid gap-4 md:grid-cols-2">
        {interviewTopics.map(({ title, text }, index) => (<TopicCard key={title} icon={interviewTopicPaths[index]} tone={interviewQuestionIcons[index].tone} title={t.content(title)} text={text} />))}
      </ul>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <ResearchTip label={null}>{t.content(interviewTopicsTakeaway)}</ResearchTip>
      </div>
    </section>
  );
}

function TopicCard({ icon, tone, title, text }: {
  icon: string;
  tone: string;
  title: string;
  text: string;
}) {
  const t = useTranslations();
  return (
    <li className="group flex items-start gap-5 rounded-3xl border border-brand-100 bg-white p-4 transition-colors hover:border-brand-300 hover:shadow-lg hover:shadow-brand-500/10 sm:p-5">
      <span aria-hidden="true" className={`flex size-10 shrink-0 items-center justify-center rounded-full sm:size-12 ${tone}`}>
        <InterviewTopicIcon path={icon} className="size-5 sm:size-6" />
      </span>
      <div className="min-w-0">
        <h3 className="text-lg font-semibold sm:text-xl">{t.content(title)}</h3>
        <p className="mt-1 max-w-lg text-base leading-relaxed text-neutral-600 lg:text-lg">{t.content(text)}</p>
      </div>
    </li>
  );
}
