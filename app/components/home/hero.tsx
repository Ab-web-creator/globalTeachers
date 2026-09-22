import type { PanelProps } from "./content";
import PrimaryButton from "./primary-button";
import StudentTrust from "./student-trust";

export default function Hero({ openPanel }: PanelProps) {
  return (
    <section className="py-2 lg:py-8" aria-labelledby="hero-title">
      <p className="mb-7 text-xs font-semibold tracking-widest text-brand-500 sm:mb-9 sm:text-base">Добро пожаловать в Globalteacherhub</p>
      <h1 id="hero-title" className="max-w-2xl text-5xl xl:text-6xl 2xl:text-7xl leading-tight font-semibold tracking-tighter">
        Ваша педагогическая карьера — без границ
      </h1>
      <p className="mt-7 max-w-xl text-base leading-loose text-[#616161] sm:mt-8 sm:text-lg">
        Хотите работать в международной школе за рубежом?
      </p>
      <div className="mt-9 flex flex-wrap gap-4 sm:mt-10 sm:gap-6">
        <PrimaryButton onClick={() => openPanel("Courses")}>Начать свой путь</PrimaryButton>
        <PrimaryButton onClick={() => openPanel("Demo")}>Try Demo <span aria-hidden="true" className="text-2xl leading-none text-brand-200">→</span></PrimaryButton>
      </div>
      <StudentTrust />
    </section>
  );
}
