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
        <div aria-hidden="true" className="pointer-events-none absolute top-0 right-0 h-28 w-52 bg-linear-to-bl from-black/80 to-transparent to-70%" />
        <span className={`absolute top-3 right-3 rounded-full border border-white/80 px-4 py-1.5 text-center text-base lg:text-sm font-semibold whitespace-nowrap text-white shadow-md ${badgeColors[program.tier]}`}>Пакет {program.tier}</span>
      </div>
      <div className="flex flex-col px-3 pt-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 text-2xl leading-tight font-medium tracking-tight">{program.title}</h3>
        </div>
        <p className="mt-2 text-base lg:text-sm leading-normal text-neutral-600">{program.description}</p>
      </div>
      <div className="px-3">
        <ProgramInclusions program={program} />
        <ProgramFeatures features={program.features} icons={program.icons} />
      </div>
      <ProgramCardFooter program={program} onDetails={onDetails} />
    </li>
  );
}
