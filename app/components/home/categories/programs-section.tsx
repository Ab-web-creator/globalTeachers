"use client";

import CategoryCard from "./category-card";
import { programs } from "./programs";

export default function ProgramsSection() {
  return (
    <section id="programs" aria-labelledby="programs-title" className="bg-white">
      <div className="mx-auto max-w-400 px-6 py-10 sm:py-12 lg:py-20 xl:py-24 sm:px-10 lg:px-16 xl:px-20">
        <header data-reveal className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <p className="mb-4 text-sm font-semibold tracking-widest text-brand-500 uppercase sm:mb-6">НАШИ ПРОГРАММЫ</p>
            <h2 id="programs-title" className="max-w-3xl text-4xl sm:text-5xl md:text-4xl xl:text-5xl 2xl:text-6xl leading-none font-semibold tracking-wide text-brand-700">Выберите свой путь<br className="hidden sm:block" /> к международной карьере</h2>
          </div>
        </header>
        <ul className="mt-10 sm:mt-12 grid gap-20 sm:gap-5 lg:grid-cols-3 lg:gap-x-8 xl:gap-x-12">
          {programs.map((program) => <CategoryCard key={program.tier} program={program} />)}
        </ul>
      </div>
    </section>
  );
}
