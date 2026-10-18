"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import SupportJourneyAnimation from "./support-journey-animation";
import ProgramSection from "../components/program-section";
import Prose from "../components/prose";
import { difference } from "./content";

export default function VipDifference() {
  const t = useTranslations();
  return (
    <ProgramSection id="vip-difference" label={t("programs.vip.vipDifference.message1332")} title={<>{t("programs.vip.vipDifference.message1333")}<br />{t("programs.vip.vipDifference.message1334")}<br /><span className="text-brand-500">{t("programs.vip.vipDifference.message1335")}</span></>} asideClassName="max-sm:hidden" aside={<SupportJourneyAnimation />}>
      <Prose paragraphs={difference.paragraphs} />
      <p className="mt-6 max-w-lg border-l-2 border-brand-300 pl-4 text-lg font-semibold leading-relaxed text-brand-600">
        {t.content(difference.closing)}
      </p>
    </ProgramSection>
  );
}
