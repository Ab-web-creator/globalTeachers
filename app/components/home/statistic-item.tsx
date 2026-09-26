type StatisticItemProps = { value: string; label: string };

export default function StatisticItem({ value, label }: StatisticItemProps) {
  return (
    <div data-reveal className="mx-auto flex w-fit max-w-full flex-col items-center justify-center gap-3 border-b border-brand-100 py-8 text-center first:pt-4 last:border-b-0 last:pb-4 sm:mx-0 sm:w-auto sm:border-b-0 sm:px-4 sm:py-4 sm:even:border-l sm:even:border-brand-100 lg:border-l lg:border-brand-100 lg:first:border-l-0">
      <dt className="order-last text-base text-neutral-600 sm:text-lg">{label}</dt>
      <dd className="text-3xl font-semibold tracking-tight text-neutral-900 xl:text-4xl">{value}</dd>
    </div>
  );
}
