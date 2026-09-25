import type { PanelProps } from "./content";

export default function Hero({ openPanel }: PanelProps) {
  return (
    <div className="relative z-10 max-w-3xl py-12 sm:py-16 lg:py-20">
      <p className="mb-4 text-xs font-semibold tracking-widest text-brand-200 uppercase sm:text-sm">Международная карьера педагога</p>
      <h1 id="hero-title" className="text-4xl leading-none font-semibold tracking-wide text-white sm:text-5xl xl:text-6xl 2xl:text-7xl">
        Ваш опыт.<br />Новая страна.<br />
        <span className="text-brand-200">Новые возможности.</span>
      </h1>
      <p className="mt-6 max-w-xl text-base leading-relaxed text-brand-50 sm:text-lg">
        Помогаем учителям из СНГ строить карьеру за рубежом — от оценки опыта и подготовки CV до собеседований и международного оффера.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
        <button type="button" onClick={() => openPanel("Consultation")} className="inline-flex items-center justify-center gap-4 rounded-full bg-linear-to-r from-amber-200 to-orange-300 px-6 py-4 text-base font-semibold text-stone-900 transition hover:from-amber-300 hover:to-orange-400 hover:shadow-md">
          Получить консультацию
        </button>
        <a href="#programs" className="rounded-full border border-brand-200/60 px-6 py-4 text-base font-medium text-white transition hover:action-gradient/10">Выбрать программу</a>
      </div>
      <p className="mt-6 text-sm leading-normal text-brand-200">Понятный план. Личная поддержка. Ваш следующий шаг.</p>
    </div>
  );
}
