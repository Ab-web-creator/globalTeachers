"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import Link from "next/link";
import SupportBanner from "../support-banner";

export default function SearchSupport() {
  const t = useTranslations();
  return (
    <SupportBanner
      id="job-search-support"
      label={t("services.jobSearch.searchSupport.message1718")}
      title={t("services.jobSearch.searchSupport.message1719")}
      text="В рамках START мы поможем оценить ваш профиль, определить подходящие направления и составить понятный план самостоятельного поиска."
      image="/images/benefits/relocation.webp"
    >
      <Link href="/programs/start" className="action-gradient rounded-full px-6 py-3 text-sm font-medium text-white">{t("services.jobSearch.searchSupport.message1721")}</Link>
      <Link href="/#plans" className="action-gradient-outline rounded-full px-6 py-3 text-sm font-medium">{t("programs.programCta.message1112")}</Link>
    </SupportBanner>
  );
}
