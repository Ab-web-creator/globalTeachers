"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import IconList from "../components/icon-list";
import { iconTones } from "../components/icon-tones";
import ProgramSection from "../components/program-section";
import { offer } from "./content";

export default function VipOffer() {
  const t = useTranslations();
  return (
    <ProgramSection id="vip-offer" label={t("programs.vip.vipOffer.message1338")} title={<span className="block max-w-[22ch]">{t("programs.vip.vipOffer.message1339")}</span>} fade="violet" fadeDirection="down" fadeToWhite>
      <div className="mt-7 max-w-3xl space-y-4">
        <p className="max-w-lg text-lg leading-relaxed text-neutral-600">
          {t.content(offer.paragraphs[0])}
        </p>
        <p className="max-w-lg text-lg leading-relaxed text-neutral-600">
          <strong className="font-semibold text-brand-950">{t("programs.vip.vipOffer.message1340")}</strong>
        </p>
      </div>

      <div className="[&>ul>li]:p-3 sm:[&>ul>li]:p-4 [&>ul>li:last-child]:bg-violet-50 [&>ul>li:last-child>span:last-child]:text-violet-900">
      <IconList
        items={offer.items.map((item, index) => ({
          ...item,
          tone: item.icon === "more" ? "bg-violet-100 text-violet-600" : iconTones[index % iconTones.length],
        }))}
        cards
        outlined
        bold
      />
      </div>

      <p className="mt-10 max-w-lg border-l-2 border-brand-300 pl-4 text-lg font-semibold leading-relaxed text-brand-600 sm:mt-12">
        {t.content(offer.closing)}
      </p>
    </ProgramSection>
  );
}
