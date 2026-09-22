const benefits = [
  "Практические рекомендации от специалиста с международным опытом",
  "Подготовка CV, портфолио и интервью по международным стандартам",
  "Индивидуальная стратегия поиска с учётом вашего опыта и целей",
];

export default function AboutBenefits() {
  return (
    <ul className="mt-7 space-y-3 text-base text-neutral-800 sm:mt-8 sm:text-lg">
      {benefits.map((benefit, index) => (
        <li key={index} className="flex items-start gap-3">
          <svg viewBox="0 0 24 24" fill="none" className="size-6 shrink-0 text-brand-500" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m3 12 6 6L22 5" /></svg>
          <span>{benefit}</span>
        </li>
      ))}
    </ul>
  );
}
