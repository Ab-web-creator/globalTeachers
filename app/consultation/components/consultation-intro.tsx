"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
export default function ConsultationIntro() {
  const t = useTranslations();
  return (
    <div className="relative max-w-xl">
      <p className="hidden text-sm font-medium tracking-widest text-slate-500 uppercase lg:block">{t("consultation.consultationIntro.message0488")}</p>
      <h1 className="mt-4 hidden text-5xl leading-none font-semibold tracking-tight text-gray-450 lg:block xl:text-5xl">{t("consultation.consultationIntro.message0489")}<br />{t("consultation.consultationIntro.message0490")}</h1>
      <div className="lg:mt-6 lg:max-w-md">
        <p className="text-base leading-relaxed text-slate-800 sm:text-lg">{t("consultation.consultationIntro.message0491")}</p>
      </div>
    </div>
  );
}
