import Image from "next/image";
import { useState } from "react";
import type { Program } from "./programs";
import ProgramFeatures from "./program-features";
import ProgramInclusions from "./program-inclusions";
import ProgramCardFooter from "./program-card-footer";

type CategoryCardProps = { program: Program };

const badgeColors: Record<string, string> = {
  START: "bg-green-700",
  PRO: "bg-blue-600",
  VIP: "bg-purple-600",
};

export default function CategoryCard({ program }: CategoryCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  return (
    <li data-reveal className="relative flex flex-col bg-white before:absolute before:-top-12 before:left-1/2 before:w-screen before:-translate-x-1/2 before:h-1 before:bg-linear-to-r before:from-blue-100 before:to-violet-200 first:before:hidden sm:before:hidden sm:rounded-2xl sm:border sm:border-neutral-200/60 sm:p-2.5 lg:row-span-4 lg:grid lg:grid-rows-subgrid lg:gap-y-0">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-brand-100">
        {imageFailed ? <p className="flex h-full items-center justify-center text-brand-500">Фото программы {program.tier}</p> :
          <Image src={program.image} alt={program.alt} fill sizes="(max-width: 1024px) 90vw, 30vw" className="object-cover object-top" onError={() => setImageFailed(true)} />}
        <span className={`absolute top-3 left-3 rounded-full border border-white/80 px-4 py-1.5 text-center text-base lg:text-sm font-semibold whitespace-nowrap text-white shadow-md sm:right-3 sm:left-auto ${badgeColors[program.tier]}`}>Пакет {program.tier}</span>
      </div>
      <div className="flex flex-col pt-4 sm:px-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 text-2xl leading-tight font-medium tracking-tight">{program.title}</h3>
        </div>
        <p className="mt-2 text-base lg:text-sm leading-normal text-neutral-600">{program.description}</p>
      </div>
      <div className="sm:px-3">
        <ProgramInclusions program={program} />
        <ProgramFeatures features={program.features} icons={program.icons} />
      </div>
      <ProgramCardFooter program={program} />
    </li>
  );
}
