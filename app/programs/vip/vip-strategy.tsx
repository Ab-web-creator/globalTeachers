"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import AnimatedStrategyList from "./animated-strategy-list";
import ProgramSection from "../components/program-section";
import { strategy } from "./content";

export default function VipStrategy() {
  const t = useTranslations();
  return (
    <ProgramSection id="vip-strategy" label={t("programs.vip.vipStrategy.message1352")} title={<>{t("programs.vip.vipStrategy.message1353")}{" "}<span className="text-brand-500">{t("programs.vip.vipStrategy.message1354")}</span> {" "}{t("programs.vip.vipStrategy.message1355")}<br />{t("programs.vip.vipStrategy.message1356")}</>}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 bg-linear-to-b from-violet-50 to-violet-50/0 to-25%" />
      {strategy.paragraphs.map((text) => (
        <p key={text} className="mt-7 max-w-lg text-lg leading-relaxed text-neutral-600">{t.content(text)}</p>
      ))}
      <h3 className="mt-4 text-lg font-semibold leading-relaxed text-brand-950">{t("programs.vip.vipStrategy.message1357")}</h3>
      <AnimatedStrategyList items={strategy.items} />
      <p className="mt-10 max-w-lg border-l-2 border-brand-300 pl-4 text-lg font-semibold leading-relaxed text-brand-600 sm:mt-12">
        {t.content(strategy.closing)}
      </p>
    </ProgramSection>
  );
}
