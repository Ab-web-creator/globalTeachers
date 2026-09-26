import Link from "next/link";

export default function Hero() {
  return (
    <div className="relative z-10 ml-auto max-w-3xl py-12 text-right text-shadow-lg text-shadow-black/70 sm:py-16 sm:text-shadow-none lg:py-24 xl:py-28">
      <p className="mb-4 text-xs font-semibold tracking-widest text-white uppercase sm:text-sm sm:text-brand-200">Международная карьера педагога</p>
      <h1 id="hero-title" className="text-4xl leading-none font-semibold tracking-wide text-white sm:text-5xl xl:text-6xl 2xl:text-7xl">
        Ваш опыт.<br />Новая страна.<br />
        <span className="text-amber-200 sm:text-brand-200">Новые возможности.</span>
      </h1>
      <p className="mt-6 ml-auto max-w-xl text-base font-medium leading-relaxed text-white sm:text-lg sm:font-normal sm:text-brand-50">
        Помогаем учителям из СНГ строить карьеру за рубежом — от оценки опыта и подготовки CV до собеседований и международного оффера.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-end gap-3 sm:gap-4">
        <Link href="/consultation" className="inline-flex items-center justify-center gap-4 rounded-full bg-linear-to-r from-amber-200 to-orange-300 px-6 py-4 text-base font-semibold text-stone-900 text-shadow-none transition hover:from-amber-300 hover:to-orange-400 hover:shadow-md">
          Получить консультацию
        </Link>
        <a href="#programs" className="rounded-full border border-white px-6 py-4 text-base font-medium text-white transition hover:action-gradient/10 sm:border-brand-200/60">Выбрать программу</a>
      </div>
      <p className="mt-6 text-sm font-medium leading-normal text-white sm:font-normal sm:text-brand-200">Понятный план. Личная поддержка. Ваш следующий шаг.</p>
    </div>
  );
}
