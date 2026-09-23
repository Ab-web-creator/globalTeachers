import type { PanelProps } from "./content";
import PrimaryButton from "./primary-button";
import SecondaryButton from "./secondary-button";
import StudentTrust from "./student-trust";

export default function Hero({ openPanel }: PanelProps) {
  return (
    <section className="py-2 lg:py-8" aria-labelledby="hero-title">
      <p className="mb-7 text-xs font-semibold tracking-wide text-brand-500 uppercase sm:mb-9 sm:text-base">МЕЖДУНАРОДНАЯ КАРЬЕРА ПЕДАГОГА</p>
      <h1 id="hero-title" className="max-w-2xl text-4xl sm:text-5xl md:text-4xl xl:text-5xl 2xl:text-6xl leading-tight font-semibold tracking-wide">
        Помогаем учителям из СНГ строить карьеру зарубежом
      </h1>
      <p className="mt-7 max-w-xl text-base leading-loose text-[#616161] sm:mt-8 sm:text-lg">
        Хотите работать в международной школе за рубежом, но сомневаетесь в своих силах?
        Ваш опыт может быть ценнее, чем вы думаете. Расскажите нам о себе — вместе
        определим ваши сильные стороны и обсудим первые шаги к работе за границей.
      </p>
      <div className="mt-9 flex max-w-xl flex-wrap gap-4 sm:mt-10 sm:gap-6">
        <SecondaryButton className="min-w-max flex-1 basis-64" onClick={() => openPanel("Courses")}>
          <span className="whitespace-nowrap">Отправить запрос</span>
          <span aria-hidden="true" className="shrink-0 text-2xl leading-none text-brand-700">→</span>
        </SecondaryButton>
        <PrimaryButton className="min-w-max flex-1 basis-64" onClick={() => openPanel("Demo")}>
          <span className="whitespace-nowrap">Оценить свои шансы</span>
          <span aria-hidden="true" className="shrink-0 text-2xl leading-none text-brand-200">→</span>
        </PrimaryButton>
      </div>
      <StudentTrust />
    </section>
  );
}
