type StatisticItemProps = { value: string; label: string };

export default function StatisticItem({ value, label }: StatisticItemProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-4 py-4 text-center sm:even:border-l sm:even:border-brand-100 lg:border-l lg:border-brand-100 lg:first:border-l-0">
      <dt className="order-last text-base text-neutral-600 sm:text-lg">{label}</dt>
      <dd className="text-3xl font-semibold tracking-tight text-neutral-900 xl:text-4xl">{value}</dd>
    </div>
  );
}
