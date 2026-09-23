import Image from "next/image";
import { useState } from "react";
import type { Program } from "./programs";
import ProgramFeatures from "./program-features";
import ProgramInclusions from "./program-inclusions";

type CategoryCardProps = { program: Program; onDetails: () => void };

export default function CategoryCard({ program, onDetails }: CategoryCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  return (
    <li className="flex flex-col rounded-2xl border border-brand-500 bg-white p-2.5 lg:row-span-4 lg:grid lg:grid-rows-subgrid lg:gap-y-0">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-brand-100">
        {imageFailed ? <p className="flex h-full items-center justify-center text-brand-500">Фото программы {program.tier}</p> :
          <Image src={program.image} alt={program.alt} fill sizes="(max-width: 1024px) 90vw, 30vw" className="object-cover object-top" onError={() => setImageFailed(true)} />}
      </div>
      <div className="flex flex-col px-3 pt-4">
        <span className={`mb-2 self-start rounded-full px-3 py-1 text-xs font-semibold ${program.tier === "VIP" ? "bg-amber-100 text-amber-900" : "bg-brand-100 text-brand-500"}`}>{program.tier}</span>
        <h3 className="text-2xl leading-tight font-medium tracking-tight">{program.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600">{program.description}</p>
      </div>
      <div className="px-3">
        <ProgramInclusions program={program} />
        <ProgramFeatures features={program.features} icons={program.icons} />
      </div>
      <div className="flex justify-center px-3 pb-3">
        <button onClick={onDetails} className="self-center rounded-full bg-brand-100 px-10 py-3 text-sm font-medium text-brand-500 transition hover:bg-brand-200" aria-label={`Подробнее о программе ${program.tier}`}>Подробнее <span aria-hidden="true">→</span></button>
      </div>
    </li>
  );
}
