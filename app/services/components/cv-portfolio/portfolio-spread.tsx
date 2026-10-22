"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import Image from "next/image";
import { portfolioItems } from "./content";
import { portfolioExamples } from "./portfolio-examples";
import { portfolioSampleTexts } from "./portfolio-sample-texts";

export default function PortfolioSpread({ active }: { active: number }) {
  const t = useTranslations();
  const item = portfolioItems[active];
  const example = portfolioExamples[active];
  const sample = portfolioSampleTexts[active];
  const prioritizeTeacher = item.image === "/images/portfolio/achievements-teacher.webp" || item.image === "/images/portfolio/leadership.webp";

  return (
    <div className="relative grid overflow-hidden rounded-xl bg-white shadow-lg lg:grid-cols-2">
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 z-10 hidden w-8 -translate-x-1/2 bg-linear-to-r from-neutral-100/0 via-neutral-200/60 to-neutral-100/0 lg:block" />
      <div className="flex flex-col px-6 pt-4 pb-8 sm:px-10 sm:pt-5 sm:pb-10 lg:pr-12">
        <div className="flex items-center justify-between border-b border-brand-100 pb-4 text-xs tracking-widest text-neutral-400 uppercase">
          <span>Teacher Portfolio</span><span className="tabular-nums">{t.content(String(active * 2 + 1).padStart(2, "0"))}</span>
        </div>
        <p className="mt-8 text-lg font-medium text-brand-500">{t.content(example.artifact)}</p>
        <h3 className="mt-3 text-2xl font-semibold leading-snug tracking-tight text-brand-950 sm:text-3xl">{t.content(item.title)}</h3>
        <p className="mt-7 text-base leading-relaxed text-neutral-600">{t.content(item.text)}</p>
        <dl className="mt-8 space-y-5">
          {[["Цель", example.goal], [example.roleLabel ?? "Моя роль", example.role], ["Что приложить", example.evidence]].map(([label, text]) => (
            <div key={label}>
              <dt className="text-base font-semibold text-brand-950">{t.content(label)}</dt>
              <dd className="mt-2 text-base leading-relaxed text-neutral-600">{t.content(text)}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="flex flex-col border-t border-brand-100 px-6 pt-4 pb-8 sm:px-10 sm:pt-5 sm:pb-10 lg:border-t-0 lg:pl-12">
        <div className="flex items-center justify-between border-b border-brand-100 pb-4 text-xs tracking-widest text-neutral-400 uppercase">
          <span>{t("services.cvPortfolio.portfolioSpread.message1543")}</span><span className="tabular-nums">{t.content(String(active * 2 + 2).padStart(2, "0"))}</span>
        </div>
        <figure className="mt-8">
          <div className="relative rotate-1 border border-neutral-200 bg-white p-2 shadow-md">
            <span aria-hidden="true" className={`absolute -top-3 z-10 h-6 w-20 -translate-x-1/2 -rotate-6 bg-amber-100/80 ${prioritizeTeacher ? "left-1/4" : "left-1/2"}`} />
            <div className="relative aspect-video overflow-hidden bg-brand-50 lg:aspect-2/1">
              <Image src={item.image} alt={t.content(`Иллюстрация раздела «${example.tab}»`)} fill sizes="(min-width: 1024px) 40vw, 90vw" className={`object-cover ${prioritizeTeacher ? "object-top" : ""}`} />
            </div>
          </div>
          <figcaption className="mt-5 text-base leading-relaxed text-neutral-500">{t.content(sample.caption)}</figcaption>
        </figure>
        <div className="mt-4 border-t border-dashed border-brand-200 pt-3">
          <p className="text-base font-semibold text-brand-950">{t("services.cvPortfolio.portfolioSpread.message1545")}</p>
          <p className="mt-2 text-base leading-relaxed text-neutral-600">{t.content(sample.reflection)}</p>
          <p className="mt-3 text-xs text-neutral-400">{t("services.cvPortfolio.portfolioSpread.message1546")}</p>
        </div>
      </div>
    </div>
  );
}
