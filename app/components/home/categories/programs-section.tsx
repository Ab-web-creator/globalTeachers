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
            <p className="mb-5 text-sm font-semibold tracking-widest text-brand-500 uppercase">НАШИ ПРОГРАММЫ</p>
            <h2 id="programs-title" className="max-w-3xl text-5xl leading-tight font-semibold tracking-tight 2xl:text-6xl">Выберите свой путь<br className="hidden sm:block" /> к международной карьере</h2>
          </div>
        </header>
        <ul className="mt-8 grid gap-5 lg:grid-cols-3">
          {programs.map((program) => <CategoryCard key={program.tier} program={program} onDetails={() => showDetails(program)} />)}
        </ul>
      </div>
      <ProgramDialog dialog={dialog} program={selected} />
    </section>
  );
}
