import Link from "next/link";

export default function Hero() {
  return (
    <div className="relative z-10 max-w-3xl py-6 text-left sm:ml-auto sm:py-16 sm:text-right lg:py-24 xl:py-28">
      <p className="mb-4 text-xs font-semibold tracking-widest text-white uppercase sm:text-sm sm:text-brand-950">Международная карьера педагога</p>
      <h1 id="hero-title" className="text-4xl leading-none font-semibold tracking-wide text-white sm:text-5xl sm:text-brand-950 sm:text-shadow-lg sm:text-shadow-white/90 xl:text-6xl 2xl:text-7xl">
        <span className="hidden sm:inline">Ваш опыт.<br /></span>
        Новая страна.<br />
        <span>Новые возможности.</span>
      </h1>
      <p className="mt-6 max-w-xl text-base font-semibold leading-relaxed text-white sm:ml-auto sm:text-lg sm:font-normal sm:text-brand-950">
        Помогаем учителям из СНГ строить карьеру за рубежом<span className="sm:hidden">.</span>
        <span className="hidden sm:inline"> — от оценки опыта и подготовки CV до собеседований и международного оффера.</span>
      </p>
      <div className="mt-8 hidden flex-wrap items-center justify-start gap-3 sm:flex sm:justify-end sm:gap-4">
        <Link href="/consultation" className="inline-flex items-center justify-center gap-4 rounded-2xl sm:rounded-full action-gradient px-6 py-2.5 sm:py-4 text-base font-semibold text-white transition hover:shadow-md">
          Получить консультацию
        </Link>
        <a href="#programs" className="hidden rounded-2xl sm:rounded-full border border-brand-200 bg-brand-50 px-6 py-2.5 sm:py-4 text-base font-semibold text-brand-950 transition hover:bg-brand-100 sm:inline-flex sm:font-medium">Выбрать программу</a>
      </div>
      <p className="mt-6 hidden text-sm font-semibold leading-normal text-brand-950 sm:block sm:font-normal">Понятный план. Личная поддержка. Ваш следующий шаг.</p>
    </div>
  );
}
