"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import IconList from "../components/icon-list";
import { iconTones } from "../components/icon-tones";
import ProgramSection from "../components/program-section";
import { preparation } from "./content";

export default function VipPreparationOverview() {
  const t = useTranslations();
  return (
    <div className="relative isolate">
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 bg-linear-to-r from-sky-50 to-violet-100" />
      <ProgramSection id="vip-preparation" label={t("programs.vip.vipPreparationOverview.message1341")} title={<span className="block max-w-[32ch]">{t("programs.vip.vipPreparationOverview.message1342")}{" "}<span className="text-brand-500">{t("programs.vip.vipPreparationOverview.message1343")}</span></span>}>
        <p className="mt-7 max-w-[62ch] text-lg leading-relaxed text-neutral-600">
          {t.content(preparation.paragraphs[0])}
        </p>
        <h3 className="mt-4 text-lg font-semibold leading-relaxed text-brand-950">{t("programs.vip.vipPreparationOverview.message1344")}</h3>
        <div className="max-sm:[&>ul>li]:p-3 max-sm:[&>ul>li>span:first-child]:size-9 max-sm:[&>ul>li>span:first-child>svg]:size-4 max-sm:[&>ul>li>span:last-child]:text-base">
          <IconList items={preparation.items.map((item, index) => ({ ...item, tone: iconTones[index] }))} cards textSize="lg" />
        </div>
        <p className="mt-10 max-w-lg border-l-2 border-brand-300 pl-4 text-lg leading-relaxed text-brand-600 sm:mt-12">
          {t.content(preparation.paragraphs[1])}{t.content(" ")}
          <strong className="font-semibold text-brand-600">{t.content(preparation.closing)}</strong>
        </p>
      </ProgramSection>
    </div>
  );
}
