"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import Link from "next/link";
import SupportBanner from "../support-banner";

export default function InterviewSupport() {
  const t = useTranslations();
  return (
    <SupportBanner
      id="interview-vip-support"
      label={t("services.careerSupport.careerSupportBanner.message1363")}
      title={t("services.interviewPreparation.interviewSupport.message1627")}
      text="В программе VIP мы готовимся не к абстрактному интервью, а к конкретной школе: изучаем её curriculum, ценности и требования вакансии, разбираем возможные вопросы и выбираем сильные примеры из вашего опыта. После интервью вместе разбираем, как оно прошло и что улучшить перед следующим этапом."
      image="/images/interview-vip-preparation.webp"
      imageClassName="object-top"
      imageContainerClassName="aspect-4/3 sm:aspect-auto"
    >
      <Link href="/programs/vip" className="action-gradient inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white">{t("services.careerSupport.careerSupportBanner.message1366")}{" "}<span aria-hidden="true">→</span></Link>
      <Link href="/#plans" className="action-gradient-outline rounded-full px-6 py-3 text-sm font-medium">{t("programs.programCta.message1112")}</Link>
    </SupportBanner>
  );
}
