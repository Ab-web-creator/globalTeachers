"use client";

import { offerAcceptedCheckIconPath, programIconPaths, StrokeIcon } from "@/app/components/svg";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import SectionFade from "../../services/components/cv-portfolio/section-fade";
import SectionLabel from "../../services/components/job-search/section-label";
import SectionHeading from "../../services/components/section-heading";
import Prose from "../components/prose";
import { afterOffer } from "./content";

const steps = [
  { title: "Оффер принят", icon: programIconPaths.letter, text: "Предложение принято — начинаем следующий этап вместе." },
  { title: "Коммуникация со школой", icon: programIconPaths.chat, text: "Помогаем с вопросами и уточнением следующих шагов." },
  { title: "Документы", icon: programIconPaths.document, text: "Помогаем разобраться, какие документы подготовить с вашей стороны." },
  { title: "Рабочая виза", icon: programIconPaths.passport, text: "Объясняем этапы оформления и действия, которые школа ожидает от вас." },
  { title: "Подготовка к переезду", icon: programIconPaths.truck, text: "Обсуждаем практические детали и подготовку к новому этапу." },
];

export default function VipAfterOffer() {
  const timeline = useRef<HTMLOListElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!timeline.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();

      // Advance once, pausing on each step, then return all steps to their normal colors.
      for (let index = 1; index < steps.length; index += 1) {
        timers.push(setTimeout(() => setActiveStep(index), index * 2000));
      }
      timers.push(setTimeout(() => setActiveStep(-1), steps.length * 2000));
    }, { threshold: 0.15 });

    observer.observe(timeline.current);
    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <section aria-labelledby="vip-after-offer" className="relative isolate py-12 sm:py-16 lg:py-20">
      <SectionFade tone="violet" direction="down" toWhite />
      <div className="grid items-center gap-10 min-[1000px]:grid-cols-12 min-[1000px]:gap-8">
        <div className="min-[1000px]:col-span-7">
          <SectionLabel>После оффера</SectionLabel>
          <SectionHeading id="vip-after-offer">Предложение принято.<br /><span className="text-brand-500">Что дальше?</span></SectionHeading>
          <Prose paragraphs={afterOffer.paragraphs} />
          <p className="mt-6 text-lg font-semibold leading-relaxed text-neutral-600">{afterOffer.closing}</p>
        </div>
        <div className="hidden min-[1000px]:col-span-5 min-[1000px]:block">
          <div className="relative mx-auto w-full max-w-sm">
            <Image src="/images/vip-after-offer-transparent.webp" alt="Документы, паспорт и подготовка к переезду" width={1254} height={1254} sizes="(min-width: 640px) 384px, 90vw" className="h-auto w-full object-contain" />
            <p style={{ fontFamily: '"Segoe Print", "Bradley Hand", cursive' }} className="absolute bottom-1/8 left-1/4 -rotate-12 rounded-sm bg-brand-500 px-4 py-3 text-left text-sm italic leading-relaxed text-white shadow-md sm:px-5 sm:py-4 sm:text-lg">Новый этап.<br />Мы рядом.</p>
          </div>
        </div>
      </div>
      <div className="mt-10">
        <ol ref={timeline} className="grid gap-6 md:grid-cols-5 md:gap-4">
          {steps.map(({ title, icon, text }, index) => (<li key={title} data-active={index === activeStep} className="group relative flex items-start gap-4 text-left md:flex-col">
            <div className="relative flex shrink-0 md:w-full">
              {index < steps.length - 1 && <span aria-hidden="true" className="absolute top-8 left-8 hidden h-px w-full bg-brand-200 md:block" />}
              <span aria-hidden="true" className={`relative flex size-16 items-center justify-center rounded-full bg-brand-50 text-brand-400 transition-colors duration-500 group-data-[active=true]:bg-brand-200 group-data-[active=true]:text-brand-600 motion-reduce:transition-none ${activeStep === -1 ? "group-hover:bg-brand-200 group-hover:text-brand-600" : ""}`}>
                <StrokeIcon path={icon} className="size-7" />
              </span>
            </div>
            <div className="min-w-0">
              <h3 className={`text-lg font-semibold leading-snug text-brand-950 transition-colors duration-500 group-data-[active=true]:text-brand-600 motion-reduce:transition-none ${activeStep === -1 ? "group-hover:text-brand-600" : ""}`}>{title}</h3>
              {index === 0 ? (<span className="mt-3 inline-flex items-center gap-2 text-lg text-brand-600"><StrokeIcon path={offerAcceptedCheckIconPath} className="size-5" />Принято</span>) : (<p className="mt-3 text-lg leading-relaxed text-neutral-600">{text}</p>)}
            </div>
          </li>))}
        </ol>
      </div>
    </section>
  );
}
