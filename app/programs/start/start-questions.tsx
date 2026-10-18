"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import ProgramSection from "../components/program-section";
import AnimatedQuestions from "./animated-questions";

export default function StartQuestions() {
  const t = useTranslations();
  return (
    <ProgramSection id="start-questions" label={t("programs.start.startQuestions.message1228")} title={t("programs.start.startQuestions.message1229")}>
      <p className="mt-7 max-w-3xl text-lg leading-relaxed text-neutral-600">{t("programs.start.startQuestions.message1230")}</p>
      <div className="mt-10 text-lg">
        <AnimatedQuestions />
      </div>
    </ProgramSection>
  );
}
