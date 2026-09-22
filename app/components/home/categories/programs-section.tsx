"use client";

import { useRef, useState } from "react";
import CategoryCard from "./category-card";
import ProgramDialog from "./program-dialog";
import { programs, type Program } from "./programs";

export default function ProgramsSection() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<Program | null>(null);
  function showDetails(program: Program | null) {
    setSelected(program);
    dialog.current?.showModal();
  }
  return (
    <section id="programs" aria-labelledby="programs-title" className="bg-white">
      <div className="mx-auto max-w-400 px-6 py-16 sm:px-10 lg:px-16 xl:px-20">
        <header className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <p className="mb-5 text-sm font-semibold tracking-widest text-brand-500">НАШИ ПРОГРАММЫ</p>
            <h2 id="programs-title" className="max-w-3xl text-3xl leading-tight font-semibold tracking-tight sm:text-4xl xl:text-5xl">Выберите свой путь<br className="hidden sm:block" /> к международной карьере</h2>
          </div>
          <button onClick={() => showDetails(null)} className="shrink-0 rounded-full bg-brand-100 px-6 py-3 text-sm font-medium text-brand-500 hover:bg-brand-200">Все программы <span aria-hidden="true">→</span></button>
        </header>
        <ul className="mt-8 grid gap-5 lg:grid-cols-3">
          {programs.map((program) => <CategoryCard key={program.tier} program={program} onDetails={() => showDetails(program)} />)}
        </ul>
      </div>
      <ProgramDialog dialog={dialog} program={selected} />
    </section>
  );
}
