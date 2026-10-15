import Link from "next/link";
import type { Program } from "../../components/home/categories/programs";
import PageTitle from "../../services/components/page-title";
import ServiceHero from "../../services/components/service-hero";

export default function PaymentHero({ program }: { program: Program }) {
  const paragraphs = program.tier === "START"
    ? [
      "Вы выбрали START — первый шаг к работе в международной школе. Заполните данные ниже и мы свяжемся с вами.",
      "Уже оставляли анкету? Укажите тот же email — после подтверждения мы заполним её за вас.",
    ]
    : [program.description];

  return (
    <ServiceHero image={program.image} backHref={`/programs/${program.tier.toLowerCase()}`} imageAspectRatio="4 / 3">
      <p className="mb-4 text-sm tracking-wide text-brand-500">Вы выбрали пакет <strong className="font-semibold">{program.tier}</strong></p>
      <PageTitle>Оплата программы {program.tier}</PageTitle>
      {paragraphs.map((paragraph, index) => (
        <p key={paragraph} className={`${index === 0 ? "mt-7" : "mt-4"} max-w-xl text-lg leading-relaxed text-neutral-600`}>{paragraph}</p>
      ))}
      <p className="mt-5 border-l-2 border-brand-300 pl-4 text-lg font-medium leading-relaxed text-brand-600">{program.supportSummary}</p>
      <div className="mt-10 flex flex-wrap items-center gap-6">
        <p className="text-4xl font-semibold text-brand-500">{program.price === null ? "Индивидуально" : `$${program.price}`}</p>
        <Link href="#payment" className="action-gradient inline-flex min-h-12 items-center justify-center rounded-full px-6 py-3 text-base font-medium text-white">Условия оплаты</Link>
      </div>
    </ServiceHero>
  );
}
