import type { PanelProps } from "./content";
import PrimaryButton from "./primary-button";
import SecondaryButton from "./secondary-button";
import StudentTrust from "./student-trust";

export default function HeroCopy({ openPanel }: PanelProps) {
  return (
    <section className="py-2 lg:py-4" aria-labelledby="hero-copy-title">
      <p className="mb-3 text-xs font-semibold tracking-wide text-brand-500 uppercase sm:mb-4 sm:text-base">МЕЖДУНАРОДНАЯ КАРЬЕРА ПЕДАГОГА</p>
      <h2 id="hero-copy-title" className="max-w-2xl text-4xl sm:text-5xl md:text-4xl xl:text-5xl 2xl:text-6xl leading-none font-semibold tracking-wide text-brand-700">
        Помогаем учителям из СНГ строить карьеру зарубежом
      </h2>
      <p className="mt-5 max-w-xl text-base leading-normal text-[#616161] sm:mt-6 sm:text-lg">
        Хотите работать в международной школе за рубежом, но сомневаетесь в своих силах?
        Ваш опыт может быть ценнее, чем вы думаете. Расскажите нам о себе — вместе
        определим ваши сильные стороны и обсудим первые шаги к работе за границей.
      </p>
      <div className="mt-6 flex max-w-xl flex-wrap gap-4 sm:mt-7 sm:gap-6">
        <SecondaryButton className="min-w-max flex-1 basis-64" onClick={() => openPanel("Courses")}>
          <span className="whitespace-nowrap">Отправить запрос</span>
        </SecondaryButton>
        <PrimaryButton className="min-w-max flex-1 basis-64" onClick={() => openPanel("Demo")}>
          <span className="whitespace-nowrap">Оценить свои шансы</span>
        </PrimaryButton>
      </div>
      <StudentTrust />
    </section>
  );
}
