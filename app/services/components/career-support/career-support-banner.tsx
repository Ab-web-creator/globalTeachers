"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import Link from "next/link";
import SupportBanner from "../support-banner";

export default function CareerSupportBanner() {
  const t = useTranslations();
  return (
    <SupportBanner
      id="career-vip-support"
      label={t("services.careerSupport.careerSupportBanner.message1363")}
      title={t("services.careerSupport.careerSupportBanner.message1364")}
      text="Программа VIP предназначена для педагогов, которым нужна помощь на протяжении всего процесса — от определения стратегии и поиска подходящих вакансий до интервью и получения предложения от международной школы."
      image="/images/career-vip-plan.webp"
      imageClassName="object-center"
    >
      <Link href="/programs/vip" className="action-gradient inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white">{t("services.careerSupport.careerSupportBanner.message1366")}{" "}<span aria-hidden="true">→</span></Link>
      <Link href="/#plans" className="action-gradient-outline rounded-full px-6 py-3 text-sm font-medium">{t("programs.programCta.message1112")}</Link>
    </SupportBanner>
  );
}
