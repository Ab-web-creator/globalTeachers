import Image from "next/image";
import Link from "next/link";
import { introduction } from "./content";

export default function JobSearchHero() {
  return (
    <header className="relative isolate overflow-hidden bg-linear-to-br from-brand-50 via-white to-brand-100">
      <div className="mx-auto grid max-w-6xl lg:grid-cols-2">
        <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-14 lg:py-20">
          <Link href="/#categories" className="text-sm text-brand-500 underline-offset-4 hover:underline">← Как мы помогаем</Link>
          <p className="mt-8 text-xs font-semibold tracking-widest text-brand-500 uppercase">Поиск работы за рубежом</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Где искать вакансии в международных школах?</h1>
          <p className="mt-6 text-base leading-relaxed text-neutral-600">{introduction}</p>
          <p className="mt-5 border-l-2 border-brand-300 pl-4 text-base font-medium leading-relaxed text-brand-700">Главное — понимать, где искать, когда начинать и на какие позиции откликаться.</p>
        </div>
        <div className="relative min-h-72 sm:min-h-96 lg:min-h-full">
          <Image src="/images/benefits/development.jpg" alt="" fill preload sizes="(min-width: 1152px) 576px, (min-width: 1024px) 50vw, 100vw" className="object-cover object-center" />
          <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-white via-transparent to-transparent lg:bg-linear-to-r" />
        </div>
      </div>
    </header>
  );
}
