"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import Link from "next/link";
import SupportBanner from "../support-banner";
import { reviewQuestions } from "./content";
import IconPanel from "./icon-panel";

export default function QualitySection() {
  const t = useTranslations();
  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2 bg-linear-to-b from-violet-100 via-blue-50 via-25% to-transparent to-50%">
      <div className="mx-auto grid max-w-400 px-6 sm:px-10 lg:grid-cols-2 lg:px-16 xl:px-20">
        <section aria-labelledby="cv-review portfolio-quality" className="grid gap-6 [&>div]:pb-7 sm:[&>div]:pb-8 lg:col-span-2 lg:grid-cols-2 py-12 sm:py-16 lg:py-20">
          <IconPanel as="div" id="cv-review" headingClassName="text-xl!" title={<>{t("services.cvPortfolio.qualitySection.message1547")}<span className="lg:hidden"> </span><br className="hidden lg:block" />{t("services.cvPortfolio.qualitySection.message1548")}</>} icon="checklist" tone="white">
            <ol className="mt-5 space-y-2.5 text-lg">
              {reviewQuestions.map((question, index) => (<li key={question} className="flex items-baseline gap-4 leading-relaxed text-neutral-600">
                <span aria-hidden="true" className="font-semibold tabular-nums text-brand-500">{t.content(String(index + 1).padStart(2, "0"))}</span>
                {t.content(question)}
              </li>))}
            </ol>
          </IconPanel>
          <IconPanel as="div" id="portfolio-quality" headingClassName="text-xl!" title={<>{t("services.cvPortfolio.qualitySection.message1549")}<span className="lg:hidden"> </span><br className="hidden lg:block" />{t("services.cvPortfolio.qualitySection.message1550")}</>} icon="gem" tone="white">
            <p className="mt-5 max-w-[64ch] text-lg leading-relaxed text-neutral-600">{t("services.cvPortfolio.qualitySection.message1551")}</p>
            <p className="mt-3 max-w-[64ch] text-lg leading-relaxed text-neutral-600">{t("services.cvPortfolio.qualitySection.message1552")}</p>
            <p className="mt-5 border-l-2 border-brand-300 pl-4 text-lg font-medium leading-relaxed text-brand-600">{t("services.cvPortfolio.qualitySection.message1553")}</p>
          </IconPanel>
        </section>
        <div className="lg:col-span-2"><SupportBanner id="cv-pro-support" label={t("services.cvPortfolio.qualitySection.message1554")} title={t("services.cvPortfolio.qualitySection.message1555")} text="В программе PRO мы поможем представить ваш опыт в формате, понятном международным школам, подготовить профессиональное CV и собрать Teacher Portfolio." image="/images/proPackage.webp">
          <Link href="/programs/pro" className="action-gradient inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white">{t("services.cvPortfolio.qualitySection.message1557")}{" "}<span aria-hidden="true">→</span></Link>
          <Link href="/#plans" className="action-gradient-outline rounded-full px-6 py-3 text-sm font-medium">{t("programs.programCta.message1112")}</Link>
        </SupportBanner></div>
      </div>
    </div>
  );
}
