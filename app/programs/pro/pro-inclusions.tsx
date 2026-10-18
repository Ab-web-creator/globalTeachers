"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import { programIconPaths } from "@/app/components/svg";
import IconCard from "../../services/components/icon-card";
import ProgramSection from "../components/program-section";
import QuestionCard from "../components/question-card";
import { cvQuestion, inclusions, inclusionsIntroduction } from "./content";

export default function ProInclusions() {
  const t = useTranslations();
  return (
    <ProgramSection id="pro-inclusions" label={t("payment.paymentIncludedSection.message1070")} title={t("programs.pro.proInclusions.message1179")} fade="sky">
      <p className="mt-7 max-w-3xl text-lg leading-relaxed text-neutral-600">{t.content(inclusionsIntroduction)}</p>
      <ul className="mt-10 grid gap-4 [&>li.group]:p-3 max-sm:[&>li.group>h3]:pt-2 sm:[&>li.group]:p-5 md:grid-cols-2 xl:grid-cols-3">
        {inclusions.map(({ icon, title, paragraphs }) => <IconCard key={title} icon={programIconPaths[icon]} title={t.content(title)} paragraphs={paragraphs} />)}
        <li>
          <QuestionCard lead={cvQuestion.lead} question={cvQuestion.question} />
        </li>
      </ul>
    </ProgramSection>
  );
}
