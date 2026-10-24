"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import IconPanel from "../../services/components/cv-portfolio/icon-panel";
import { approach, audience } from "./content";

export default function StartAudience() {
  const t = useTranslations();
  return (
    <section aria-labelledby="start-approach start-audience" className="relative left-1/2 w-screen -translate-x-1/2 bg-linear-to-r from-blue-50 to-violet-100 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto grid max-w-400 gap-6 px-6 max-sm:[&>div>span]:size-10 max-sm:[&>div>span>svg]:size-5 sm:px-10 lg:grid-cols-2 lg:px-16 xl:px-20">
        <IconPanel as="div" id="start-approach" headingClassName="max-sm:text-lg!" title={t("programs.start.startAudience.message1216")} icon="checklist" tone="white">
          {approach.paragraphs.map((text) => <p key={text} className="mt-4 text-lg leading-relaxed text-neutral-600">{t.content(text)}</p>)}
        </IconPanel>
        <IconPanel as="div" id="start-audience" bottomAlignedContent={t.language === "ru"} headingClassName="max-sm:text-lg!" title={t("programs.start.startAudience.message1217")} icon="handshake" tone="white">
          {audience.paragraphs.map((text) => <p key={text} className="mt-4 max-w-lg text-lg leading-relaxed text-neutral-600">{t.content(text)}</p>)}
          <p className={`${t.language === "ru" ? "mt-auto pt-6" : "mt-6"} text-lg font-medium leading-relaxed text-brand-600`}>{t.content(audience.note)}</p>
        </IconPanel>
      </div>
    </section>
  );
}
