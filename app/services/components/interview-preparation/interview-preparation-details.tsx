"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
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
  const t = useTranslations();
  return (
    <main className="mx-auto max-w-400 px-6 pt-6 pb-0 sm:px-10 sm:pb-16 lg:px-16 lg:pt-0 lg:pb-20 xl:px-20">
      <article>
        <ServiceHero image="/images/interview-preparation-hero.webp" imageAspectRatio="160000 / 116603" imageHeightScale={0.95}>
          <SectionLabel>{t("programs.pro.content.message1149")}</SectionLabel>
          <PageTitle>{t("services.interviewPreparation.interviewPreparationDetails.message1624")}</PageTitle>
          <div className="mt-7 space-y-5">
            {introduction.map((text) => <p key={text} className="text-base leading-relaxed text-neutral-600 sm:text-lg">{t.content(text)}</p>)}
          </div>
          <p className="mt-5 border-l-2 border-brand-300 pl-4 text-lg font-medium leading-relaxed text-brand-600">{t("services.interviewPreparation.interviewPreparationDetails.message1625")}</p>
        </ServiceHero>
        <div>
          <InterviewTopics />
        </div>
        <SchoolResearch />
        <SpeakWithExamples />
        <section aria-labelledby="unexpected-questions" className="relative isolate py-12 sm:py-16 lg:py-20">
          <SectionFade direction="down" halfHeight />
          <UnexpectedQuestions />
        </section>
        <section aria-label={t("services.interviewPreparation.interviewPreparationDetails.message1626")} className="relative isolate py-12 sm:py-16 lg:py-20">
          <SectionFade direction="down" halfHeight />
          <InterviewPractice />
        </section>
        <InterviewSupport />
      </article>
    </main>
  );
}
