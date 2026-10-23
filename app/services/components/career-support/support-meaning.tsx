"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import IconPanel from "../cv-portfolio/icon-panel";
import { supportMeaning } from "./content";
import styles from "./support-meaning.module.css";

export default function SupportMeaning() {
  const t = useTranslations();
  return (
    <section aria-labelledby="support-not support-gives" className="relative left-1/2 w-screen -translate-x-1/2 bg-linear-to-r from-blue-50 to-violet-100 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto grid max-w-400 gap-6 px-6 max-sm:[&>div]:p-3 max-sm:[&>div]:pr-5 max-sm:[&>div]:pb-5 max-sm:[&>div>span]:size-10 max-sm:[&>div>span>svg]:size-5 sm:px-10 lg:grid-cols-2 lg:px-16 xl:px-20">
        <IconPanel as="div" id="support-not" className={styles.card} bottomAlignedContent headingClassName="max-sm:text-lg!" title={t("services.careerSupport.supportMeaning.message1416")} icon="info" tone="yellow">
          <p className="mt-5 max-w-[64ch] text-lg leading-relaxed text-neutral-600">{t.content(supportMeaning.isNot)}</p>
          <p className="mt-auto pt-6 text-lg font-semibold leading-relaxed text-yellow-700">{t.content(supportMeaning.decision)}</p>
        </IconPanel>
        <IconPanel as="div" id="support-gives" className={styles.card} bottomAlignedContent headingClassName="max-sm:text-lg!" title={t("services.careerSupport.supportMeaning.message1417")} icon="handshake" tone="green">
          <p className="mt-5 max-w-[64ch] text-lg leading-relaxed text-neutral-600">{t.content(supportMeaning.is)}</p>
          <p className="mt-auto pt-6 text-lg font-semibold leading-relaxed text-yellow-700">{t("services.careerSupport.content.supportThroughout")}</p>
        </IconPanel>
      </div>
    </section>
  );
}
