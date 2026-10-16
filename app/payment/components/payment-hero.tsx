import { GiftIcon } from "@/app/components/svg";
import type { Program } from "../../components/home/categories/programs";
import PageTitle from "../../services/components/page-title";
import ServiceHero from "../../services/components/service-hero";

export default function PaymentHero({ program }: { program: Program }) {
  const isPro = program.tier === "PRO";
  const isPackageCheckout = program.tier === "START" || program.tier === "PRO";
  const paragraphs = isPro
    ? ["Вы делаете важный шаг к международной карьере. Заполните данные ниже, чтобы продолжить оформление. Если вы уже заполняли анкету, укажите тот же адрес электронной почты — мы автоматически свяжем её с вашим заказом."]
    : isPackageCheckout
    ? [
      "Вы сделали первый шаг к работе в международной школе.",
      "Заполните данные ниже, чтобы продолжить оформление. Если вы уже заполняли анкету, укажите тот же адрес электронной почты — мы используем ранее предоставленную информацию.",
    ]
    : ["Начните с персональной консультации, чтобы оценить перспективы международной карьеры и обсудить возможное сотрудничество."];

  return (
    <ServiceHero image={program.image} backHref={`/programs/${program.tier.toLowerCase()}`} imageAspectRatio="4 / 3">
      <p className="mb-4 text-sm tracking-wide text-brand-500">Вы выбрали пакет <strong className="font-semibold">{program.tier}</strong></p>
      <PageTitle>{isPro ? <>Оформление<br />пакета PRO</> : isPackageCheckout ? `Оформление пакета ${program.tier}` : "Ваш путь к VIP-сопровождению"}</PageTitle>
      {paragraphs.map((paragraph, index) => (
        <p key={paragraph} className={`${index === 0 ? "mt-7" : "mt-4"} max-w-xl text-lg leading-relaxed text-neutral-600`}>{paragraph}</p>
      ))}
      {isPro ? (
        <div className="mt-5 flex items-center gap-4 rounded-xl bg-brand-50 px-5 py-4 text-brand-500">
          <GiftIcon className="size-7 shrink-0" />
          <p className="border-l border-brand-300 pl-4 text-base font-semibold leading-relaxed sm:text-lg">Поддержка в течение 30 дней.</p>
        </div>
      ) : isPackageCheckout ? (
        <p className="mt-5 border-l-2 border-brand-300 pl-4 text-lg font-medium leading-relaxed text-brand-600">{program.supportSummary}</p>
      ) : (
        <div className="mt-5 flex w-full max-w-lg items-center gap-4 rounded-xl bg-brand-50 px-5 py-4 text-brand-500">
          <GiftIcon className="size-7 shrink-0" />
          <div className="min-w-0 flex-1 border-l border-brand-300 pl-4 text-base font-semibold leading-relaxed sm:text-lg">
            <p>Индивидуальная консультация</p>
            <p>60 минут</p>
          </div>
          <p className="shrink-0 text-2xl font-semibold sm:text-3xl">$99</p>
        </div>
      )}
      {!isPackageCheckout && (
        <div className="mt-10">
          <p className="mt-4 text-lg leading-relaxed text-neutral-600">Разовая оплата. Без обязательства приобретать VIP.</p>
        </div>
      )}
    </ServiceHero>
  );
}
