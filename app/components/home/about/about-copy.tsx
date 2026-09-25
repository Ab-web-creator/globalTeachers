import type { PanelProps } from "../content";
import AboutBenefits from "./about-benefits";

export default function AboutCopy({ openPanel }: PanelProps) {
  return (
    <div data-reveal className="px-6 py-2 sm:px-0 lg:py-4">
      <p className="mb-3 sm:mb-4 text-sm font-semibold tracking-widest text-brand-500 sm:text-base uppercase">О нас</p>
      <h2 id="about-title" className="text-4xl sm:text-5xl md:text-4xl xl:text-5xl 2xl:text-6xl leading-none font-semibold tracking-wide">
        Превращаем цель в понятный план действий
      </h2>
      <p className="mt-5 text-base leading-normal text-neutral-600 sm:text-lg">
      Международная карьера начинается не с отправки сотен резюме, а с понимания своих возможностей. Мы помогаем определить вашу точку старта, выбрать направление и выстроить понятный путь к международному офферу.
      </p>
      <AboutBenefits />
      <button onClick={() => openPanel("Courses")} className="mt-6 rounded-full bg-brand-100 px-8 py-4 text-base font-medium text-brand-500 transition hover:bg-brand-200 sm:mt-8">
        Начать свой путь
      </button>
    </div>
  );
}
