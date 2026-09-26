import Link from "next/link";
import AboutBenefits from "./about-benefits";

export default function AboutCopy() {
  return (
    <div data-reveal className="order-first px-6 py-2 sm:px-0 lg:order-none lg:py-4">
      <p className="mb-4 sm:mb-6 text-sm font-semibold tracking-widest text-brand-500 sm:text-base uppercase">О нас</p>
      <h2 id="about-title" className="text-4xl sm:text-5xl md:text-4xl xl:text-5xl 2xl:text-6xl leading-none font-semibold tracking-wide text-brand-700">
        Превращаем цель в понятный план действий
      </h2>
      <p className="mt-6 sm:mt-8 text-base leading-normal text-neutral-600 sm:text-lg">
      Международная карьера начинается не с отправки сотен резюме, а с понимания своих возможностей. Мы помогаем определить вашу точку старта, выбрать направление и выстроить понятный путь к международному офферу.
      </p>
      <AboutBenefits />
      <Link href="/consultation" className="mt-6 inline-flex rounded-2xl sm:rounded-full action-gradient-outline px-8 py-2.5 sm:py-4 text-base font-medium text-brand-700 transition hover:shadow-md sm:mt-8">
        Начать свой путь
      </Link>
    </div>
  );
}
