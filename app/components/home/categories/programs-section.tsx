"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import FeatureText from "./feature-text";
import type { Program } from "./programs";
import { programs } from "./programs";

type ProgramCardFooterProps = {
  program: Program;
};

type CategoryCardProps = {
  program: Program;
};

const badgeColors: Record<string, string> = {
  START: "bg-green-700",
  PRO: "bg-blue-600",
  VIP: "bg-purple-600",
};

export default function ProgramsSection() {
  return (
    <section id="programs" aria-labelledby="programs-title" className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-400 px-6 sm:px-10 lg:px-16 xl:px-20">
        <header data-reveal className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <p className="mb-4 text-sm font-semibold tracking-widest text-brand-500 uppercase">НАШИ ПРОГРАММЫ</p>
            <h2 id="programs-title" className="max-w-3xl text-4xl sm:text-5xl md:text-4xl xl:text-5xl 2xl:text-6xl leading-none font-semibold tracking-wide text-brand-700">Выберите свой путь<br className="hidden sm:block" /> к международной карьере</h2>
          </div>
        </header>
        <ul className="mt-10 grid gap-20 sm:gap-5 lg:grid-cols-3 lg:gap-x-8 xl:gap-x-12">
          {programs.map((program) => <CategoryCard key={program.tier} program={program} />)}
        </ul>
      </div>
    </section>
  );
}

function ProgramCardFooter({ program }: ProgramCardFooterProps) {
  return (
    <div className="@container border-t border-brand-100 pt-3 pb-2 sm:mx-3">
      <div className="flex flex-col items-start gap-4 @min-[17rem]:flex-row @min-[17rem]:items-center @min-[17rem]:justify-between">
        <p className="flex min-h-14 min-w-0 items-center text-brand-500 @min-[17rem]:flex-1">
          {program.price === null ? (<span className="flex flex-col items-start gap-1">
            <span className="rounded-md bg-brand-100 px-2 py-1 text-sm font-semibold text-brand-600">Индивидуально</span>
            <span className="text-xs leading-normal text-neutral-600">Стоимость по запросу</span>
          </span>) : (<span className="flex flex-col">
            <span className="text-3xl font-semibold tracking-tight">${program.price}</span>
            <span className="text-base lg:text-xs leading-normal text-neutral-600">единоразовая</span>
          </span>)}
        </p>
        <Link href={`/programs/${program.tier.toLowerCase()}`} className="shrink-0 rounded-2xl sm:rounded-full bg-linear-to-r from-blue-100 to-violet-200 px-5 py-2.5 sm:py-3 text-base lg:text-sm font-medium whitespace-nowrap text-brand-700 transition hover:from-blue-200 hover:to-violet-300 hover:shadow-md after:absolute after:inset-0 after:rounded-2xl" aria-label={`Подробнее о программе ${program.tier}`}>
          Подробнее
        </Link>
      </div>
    </div>
  );
}

function ProgramFeatures({ features }: {
  features: string[];
}) {
  return (
    <ul className="list-disc space-y-3 py-4 pl-5 marker:text-neutral-300">
      {features.map(feature => (<li key={feature} className="pl-1 wrap-break-word text-base leading-normal text-neutral-900">
        <FeatureText text={feature} />
      </li>))}
    </ul>
  );
}

function ProgramInclusions({ program, detailed = false }: {
  program: Program;
  detailed?: boolean;
}) {
  return (
    <div className="mt-3">
      <p className="text-base font-semibold text-blue-700">{program.inclusionLabel}</p>
      <p className="mt-1 text-base leading-normal text-neutral-600">{program.supportSummary}</p>
      {detailed && program.inheritedServices.length > 0 && (<div className="mt-3">
        <p className="text-base lg:text-sm font-medium text-neutral-900">Уже включено из предыдущих программ:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-base lg:text-sm text-neutral-600">
          {program.inheritedServices.map(service => <li key={service}>{service}</li>)}
        </ul>
        <p className="mt-3 text-base lg:text-sm font-medium text-neutral-900">Дополнения и расширенные возможности:</p>
      </div>)}
    </div>
  );
}

function CategoryCard({ program }: CategoryCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  return (
    <li data-reveal className="group relative flex flex-col bg-white transition-colors duration-300 hover:bg-brand-50 focus-within:bg-brand-50 sm:hover:border-brand-300 sm:focus-within:border-brand-300 before:absolute before:-top-12 before:left-1/2 before:w-screen before:-translate-x-1/2 before:h-1 before:bg-linear-to-r before:from-blue-100 before:to-violet-200 first:before:hidden sm:before:hidden sm:rounded-2xl sm:border sm:border-neutral-200/60 sm:p-2.5 lg:row-span-4 lg:grid lg:grid-rows-subgrid lg:gap-y-0">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-brand-100">
        {imageFailed ? <p className="flex h-full items-center justify-center text-brand-500">Фото программы {program.tier}</p> : <Image src={program.image} alt={program.alt} fill sizes="(max-width: 1024px) 90vw, 30vw" className="object-cover object-top" onError={() => setImageFailed(true)} />}
        <span className={`absolute top-3 left-3 rounded-full border border-white/80 px-4 py-1.5 text-center text-base lg:text-sm font-semibold whitespace-nowrap text-white shadow-md sm:right-3 sm:left-auto ${badgeColors[program.tier]}`}>Пакет {program.tier}</span>
      </div>
      <div className="flex flex-col pt-5 sm:px-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 text-2xl leading-tight font-medium tracking-tight transition-colors duration-300 group-hover:text-brand-600 group-focus-within:text-brand-600">{program.title}</h3>
        </div>
        <p className="mt-2 text-base leading-normal text-neutral-600">{program.description}</p>
      </div>
      <div className="sm:px-3">
        <ProgramInclusions program={program} />
        <ProgramFeatures features={program.features} />
      </div>
      <ProgramCardFooter program={program} />
    </li>
  );
}
