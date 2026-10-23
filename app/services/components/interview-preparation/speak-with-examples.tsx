"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import Image from "next/image";
import SectionFade from "../cv-portfolio/section-fade";
import SectionLabel from "../job-search/section-label";
import SectionHeading from "../section-heading";
import AnswerExample from "./answer-example";
import { speakWithExamples } from "./content";

export default function SpeakWithExamples() {
  const t = useTranslations();
  return (
    <section aria-labelledby="interview-examples" className="relative isolate grid items-center gap-10 lg:grid-cols-5 lg:gap-20 py-12 sm:py-16 lg:py-20">
      <SectionFade tone="violet" direction="down" toWhite halfHeight />
      <div className="hidden justify-items-center lg:col-span-2 lg:grid">
        <Image src="/images/interview-candidate-conversation.webp" alt={t("services.interviewPreparation.speakWithExamples.message1635")} width={896} height={816} sizes="(min-width: 1600px) 448px, 35vw" className="h-auto w-full max-w-md rounded-3xl" />
      </div>
      <div className="lg:col-span-3">
        <SectionLabel>{t("services.interviewPreparation.speakWithExamples.message1636")}</SectionLabel>
        <SectionHeading id="interview-examples">{t("services.interviewPreparation.speakWithExamples.message1637")}</SectionHeading>
        <p className="mt-7 text-lg leading-relaxed text-neutral-600">{t.content(speakWithExamples.intro)}</p>
        <div className="mt-6">
          <AnswerExample label={t("services.interviewPreparation.speakWithExamples.message1638")} className="w-full">
            <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              {speakWithExamples.weakPhrases.map((phrase, index) => {
                const text = t.content(phrase);
                const suffix = t.language === "uz" ? "deyişdan köra" : "дейишдан кўра";
                const hasUzbekSuffix = t.language !== "ru" && text.endsWith(suffix);

                return (
                  <span key={phrase} className="contents">
                    {index > 0 && <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">{t("services.interviewPreparation.speakWithExamples.message1639")}</span>}
                    <span>{hasUzbekSuffix ? text.slice(0, -suffix.length).trimEnd() : text}</span>
                    {hasUzbekSuffix && <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">{suffix}</span>}
                  </span>
                );
              })}
            </span>
          </AnswerExample>
        </div>
        <p className="mt-8 text-lg leading-relaxed text-neutral-600">{t.content(speakWithExamples.stepsIntro)}</p>
        <div className="mt-5">
          <ExampleSteps steps={speakWithExamples.steps} />
        </div>
        <p className="mt-8 max-w-3xl text-lg leading-relaxed text-neutral-600">{t.content(speakWithExamples.outcome)}</p>
        <aside className="mt-8 border-l-2 border-brand-300 pl-4">
          <p className="text-lg font-medium leading-relaxed text-brand-600">
            <strong className="font-semibold">{t("services.interviewPreparation.researchTip.message1631")}</strong> {t.content(speakWithExamples.tip)}
          </p>
        </aside>
      </div>
    </section>
  );
}

function ExampleSteps({ steps }: {
  steps: readonly string[];
}) {
  const t = useTranslations();
  return (
    <ol className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-stretch">
      {steps.map((step, index) => (<li key={step} className="flex min-w-0 items-center gap-3 md:flex-1 md:basis-48">
        {index > 0 && <span aria-hidden="true" className="hidden shrink-0 text-xl text-brand-400 md:block">→</span>}
        <div className="flex min-w-0 flex-1 items-center gap-4 self-stretch rounded-2xl border border-brand-300 bg-white/70 p-4">
          <span aria-hidden="true" className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-100/70 text-lg font-medium tabular-nums text-brand-500">{t.content(String(index + 1).padStart(2, "0"))}</span>
          <span className="min-w-0 wrap-break-word font-semibold leading-snug text-neutral-600">{t.content(step)}</span>
        </div>
      </li>))}
    </ol>
  );
}
