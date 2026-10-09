"use client";

import { CareerBenefitIcon } from "@/app/components/svg";
import Image from "next/image";
import { useState } from "react";
import type { Benefit } from "./benefits/benefits-content";
import { benefits } from "./benefits/benefits-content";

export default function Benefits() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section id="benefits" aria-labelledby="benefits-title" className="bg-linear-to-b from-brand-50/60 to-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-400 px-6 sm:px-10 lg:px-16 xl:px-20">
        <header data-reveal className="mx-auto max-w-4xl text-left sm:text-center">
          <p className="text-sm font-semibold tracking-widest text-brand-500 uppercase sm:text-base">
            Ваша будущая карьера в цифрах
          </p>
          <h2 id="benefits-title" className="mt-4 text-4xl leading-none font-semibold tracking-wide text-brand-700 sm:text-5xl md:text-4xl xl:text-5xl 2xl:text-6xl">
            $4,000 — это ещё<br className="hidden sm:block" /> не весь доход
          </h2>
          <p className="mx-auto mt-7 max-w-3xl text-base leading-normal text-neutral-600 sm:text-lg">
            Международные школы предлагают комплексный пакет, который может включать гораздо больше.
          </p>
        </header>
        <div className="@container mx-auto mt-10 w-full">
          <div className="flex flex-col items-center gap-12">
            <ul id="benefits-list" className={`grid w-full min-w-0 max-w-full grid-cols-1 justify-center gap-4 @min-[37rem]:w-auto @min-[37rem]:grid-cols-[repeat(2,16rem)] @min-[50rem]:grid-cols-[repeat(3,16rem)] @min-[67rem]:grid-cols-[repeat(4,16rem)] ${expanded ? "" : "[&>li:nth-child(n+5)]:hidden @max-[67rem]:[&>li:nth-child(4)]:hidden @min-[37rem]:@max-[50rem]:[&>li:nth-child(3)]:hidden"}`}>
              {benefits.map(benefit => (<BenefitCard key={benefit.id} benefit={benefit} />))}
            </ul>
            {!expanded && (<button type="button" aria-expanded={false} aria-controls="benefits-list" onClick={() => setExpanded(true)} className="self-start sm:self-center rounded-2xl sm:rounded-full action-gradient-outline px-5 md:px-8 py-2.5 sm:py-4 text-center text-base font-medium text-brand-700 transition-colors hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600">
              Показать все преимущества
            </button>)}
          </div>
        </div>
      </div>
    </section>
  );
}

function BenefitCard({ benefit }: {
  benefit: Benefit;
}) {
  return (
    <li data-reveal className={`relative isolate grid w-full grid-cols-[1fr_3fr] overflow-hidden rounded-3xl text-left shadow-lg shadow-slate-900/10 @min-[37rem]:block @min-[37rem]:max-w-64 @min-[37rem]:justify-self-center @min-[37rem]:text-center ${benefit.color}`}>
      <div className="relative min-h-32 @min-[37rem]:aspect-5/2 @min-[37rem]:min-h-0">
        <Image src={benefit.image} alt="" fill sizes="(max-width: 671px) 25vw, 256px" className="object-cover" />
      </div>
      <div className="relative min-w-0 p-4 @min-[37rem]:px-6 @min-[37rem]:pt-0 @min-[37rem]:pb-7">
        <div className={`float-right ml-2 flex size-8 items-center justify-center rounded-full shadow-sm [&>svg]:size-5 @min-[37rem]:float-none @min-[37rem]:mx-auto @min-[37rem]:-mt-12 @min-[37rem]:mb-3 @min-[37rem]:size-20 @min-[37rem]:[&>svg]:size-8 ${benefit.iconColor}`}>
          <CareerBenefitIcon name={benefit.id} />
        </div>
        <h3 className="text-lg leading-tight font-bold tracking-tight text-brand-950 @min-[37rem]:text-xl">
          {benefit.title}
        </h3>
        <p className={`mt-2 text-base leading-tight font-bold ${benefit.accentColor}`}>
          {benefit.subtitle}
        </p>
        <p className="mt-3 text-left text-base leading-normal text-neutral-700 @min-[37rem]:mt-5 @min-[37rem]:leading-relaxed">
          {benefit.description}
        </p>
      </div>
    </li>
  );
}
