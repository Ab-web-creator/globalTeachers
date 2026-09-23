import Image from "next/image";
import { useState } from "react";
import type { Program } from "./programs";
import ProgramFeatures from "./program-features";
import ProgramInclusions from "./program-inclusions";
import ProgramCardFooter from "./program-card-footer";

type CategoryCardProps = { program: Program; onDetails: () => void };

const badgeColors: Record<string, string> = {
  START: "bg-green-700",
  PRO: "bg-blue-600",
  VIP: "bg-purple-600",
};

export default function CategoryCard({ program, onDetails }: CategoryCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  return (
    <li className="flex flex-col rounded-2xl border border-brand-500 bg-white p-2.5 lg:row-span-4 lg:grid lg:grid-rows-subgrid lg:gap-y-0">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-brand-100">
        {imageFailed ? <p className="flex h-full items-center justify-center text-brand-500">Фото программы {program.tier}</p> :
          <Image src={program.image} alt={program.alt} fill sizes="(max-width: 1024px) 90vw, 30vw" className="object-cover object-top" onError={() => setImageFailed(true)} />}
      </div>
      <div className="flex flex-col px-3 pt-7">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 text-2xl leading-tight font-medium tracking-tight">{program.title}</h3>
          <span className={`mt-1 w-20 shrink-0 rounded-full px-4 py-1 text-center text-xs font-semibold text-white shadow-sm ${badgeColors[program.tier]}`}>{program.tier}</span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600">{program.description}</p>
      </div>
      <div className="px-3">
        <ProgramInclusions program={program} />
        <ProgramFeatures features={program.features} icons={program.icons} />
      </div>
      <ProgramCardFooter program={program} onDetails={onDetails} />
    </li>
  );
}
