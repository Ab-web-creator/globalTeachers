import StatisticItem from "./statistic-item";

const statistics = [
  { value: "15 000+", label: "международных школ" },
  { value: "5 000+", label: "актуальных вакансий" },
  { value: "100+", label: "стран для поиска работы*" },
  { value: "25 000+", label: "новых позиций ежегодно*" },
];

export default function StatisticsSection() {
  return (
    <section aria-label="Международный рынок работы в цифрах" className="mx-auto w-full max-w-400 px-6 py-10 sm:px-10 lg:px-16 lg:py-10 xl:py-12 xl:px-20">
      <dl className="grid gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {statistics.map((statistic) => <StatisticItem key={statistic.label} {...statistic} />)}
      </dl>
    </section>
  );
}
