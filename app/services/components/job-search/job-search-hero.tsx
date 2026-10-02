import Image from "next/image";
import Link from "next/link";
import { introduction } from "./content";

export default function JobSearchHero() {
  return (
    <header className="relative isolate overflow-hidden bg-white">
      <div className="relative mx-auto grid max-w-400 lg:min-h-120 lg:grid-cols-2">
        <div className="relative z-10 flex flex-col justify-center px-6 pt-14 pb-10 sm:px-10 sm:pt-16 sm:pb-14 lg:order-2 lg:px-16 lg:py-16 xl:px-20">
          <Link href="/#categories" className="group absolute top-4 left-6 z-20 inline-flex items-center gap-1.5 text-sm text-neutral-300 sm:left-10 lg:left-16 xl:left-20">
            <span className="flex size-8 items-center justify-center rounded-full transition-colors duration-200 motion-reduce:transition-none group-hover:bg-neutral-200 group-hover:text-neutral-600">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M11 6 4 12l7 6v-4h9v-4h-9z" /></svg>
            </span>
            <span className="text-neutral-500"> Назад </span>
          </Link>
          <p className="text-xs font-semibold tracking-widest text-brand-500 uppercase">Поиск работы за рубежом</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Где искать вакансии в международных школах?</h1>
          <p className="mt-6 text-base leading-relaxed text-neutral-600">{introduction}</p>
          <p className="mt-5 border-l-2 border-brand-300 pl-4 text-base font-medium leading-relaxed text-brand-700">Главное — понимать, где искать, когда начинать и на какие позиции откликаться.</p>
        </div>
        <div className="relative mx-6 min-h-72 sm:mx-10 sm:min-h-96 lg:order-1 lg:mr-0 lg:ml-16 lg:min-h-full xl:ml-20">
          <Image src="/images/benefits/development.jpg" alt="" fill preload sizes="(min-width: 1600px) 800px, (min-width: 1024px) 50vw, 100vw" className="object-cover object-center" />
          <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-white via-transparent to-transparent lg:bg-linear-to-l" />
        </div>
      </div>
    </header>
  );
}
