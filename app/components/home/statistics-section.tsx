"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import CountUp from "./count-up";

type StatisticItemProps = {
  value: number;
  label: string;
  delay: number;
};

const statistics = [
  { value: 15000, label: "международных школ" },
  { value: 5000, label: "актуальных вакансий" },
  { value: 100, label: "стран для поиска работы" },
  { value: 25000, label: "новых позиций ежегодно" },
];

export default function StatisticsSection() {
  const t = useTranslations();
  return (
    <div className="mx-auto w-full max-w-400 px-6 py-10 sm:px-10 lg:px-16 lg:py-10 xl:py-12 xl:px-20">
      <dl aria-label={t("home.statisticsSection.message0461")} className="grid sm:grid-cols-2 sm:gap-y-8 lg:grid-cols-4">
        {statistics.map((statistic, index) => <StatisticItem key={statistic.label} {...statistic} delay={index * 250} />)}
      </dl>
    </div>
  );
}

function StatisticItem({ value, label, delay }: StatisticItemProps) {
  const t = useTranslations();
  return (
    <div className="mx-auto flex w-fit max-w-full flex-col items-center justify-center gap-3 border-b border-brand-100 py-8 text-center first:pt-4 last:border-b-0 last:pb-4 sm:mx-0 sm:w-auto sm:border-b-0 sm:px-4 sm:py-4 sm:even:border-l sm:even:border-brand-100 lg:border-l lg:border-brand-100 lg:first:border-l-0">
      <dt className="order-last text-base text-neutral-600 sm:text-lg">{t.content(label)}</dt>
      <dd className="text-3xl font-semibold tracking-tight text-neutral-900 xl:text-4xl"><CountUp value={value} delay={delay} /></dd>
    </div>
  );
}
