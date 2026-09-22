import type { PanelProps } from "../content";
import AboutBenefits from "./about-benefits";

export default function AboutCopy({ openPanel }: PanelProps) {
  return (
    <div className="py-4 lg:py-8">
      <p className="mb-7 text-sm font-semibold tracking-widest text-brand-500 sm:text-base uppercase">О нас</p>
      <h2 id="about-title" className="text-4xl leading-tight font-semibold tracking-tight sm:text-5xl xl:text-6xl">
        Помогаем педагогам строить международную карьеру
      </h2>
      <p className="mt-7 text-base leading-loose text-neutral-600 sm:text-lg">
        Поиск работы за рубежом может казаться сложным: с чего начать, где искать вакансии, как составить резюме и подготовиться к интервью. GlobalTeacherHub помогает пройти этот путь уверенно и последовательно — от первого шага до получения оффера.
      </p>
      <AboutBenefits />
      <button onClick={() => openPanel("Courses")} className="mt-9 rounded-full bg-brand-100 px-8 py-4 text-base font-medium text-brand-500 transition hover:bg-brand-200 sm:mt-11">
        Get Started
      </button>
    </div>
  );
}
