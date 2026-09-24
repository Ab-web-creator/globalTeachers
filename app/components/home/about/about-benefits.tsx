const benefits = [
  "Поймёте, в каких странах и школах ваш опыт наиболее востребован",
  "Узнаете, как сильнее представить свой опыт и повысить шансы на приглашение",
  "Получите понятный план действий — от первого поиска до международного оффера",
];

export default function AboutBenefits() {
  return (
    <ul className="mt-5 space-y-3 text-base text-neutral-800 sm:mt-6 sm:text-lg">
      {benefits.map((benefit, index) => (
        <li key={index} className="flex items-start gap-3">
          <svg viewBox="0 0 24 24" fill="none" className="size-6 shrink-0 text-brand-500" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m3 12 6 6L22 5" /></svg>
          <span>{benefit}</span>
        </li>
      ))}
    </ul>
  );
}
