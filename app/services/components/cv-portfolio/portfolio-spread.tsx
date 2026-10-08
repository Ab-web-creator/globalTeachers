import Image from "next/image";
import { portfolioItems } from "./content";
import { portfolioExamples } from "./portfolio-examples";
import { portfolioSampleTexts } from "./portfolio-sample-texts";

export default function PortfolioSpread({ active }: { active: number }) {
  const item = portfolioItems[active];
  const example = portfolioExamples[active];
  const sample = portfolioSampleTexts[active];

  return (
    <div className="relative grid overflow-hidden rounded-xl bg-white shadow-lg lg:grid-cols-2">
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 z-10 hidden w-8 -translate-x-1/2 bg-linear-to-r from-neutral-100/0 via-neutral-200/60 to-neutral-100/0 lg:block" />
      <div className="flex flex-col px-6 py-8 sm:px-10 sm:py-10 lg:pr-12">
        <div className="flex items-center justify-between border-b border-brand-100 pb-4 text-xs tracking-widest text-neutral-400 uppercase">
          <span>Teacher Portfolio</span><span className="tabular-nums">{String(active * 2 + 1).padStart(2, "0")}</span>
        </div>
        <p className="mt-8 text-lg font-medium text-brand-500">{example.artifact}</p>
        <h3 className="mt-3 text-2xl font-semibold leading-snug tracking-tight text-brand-950 sm:text-3xl">{item.title}</h3>
        <p className="mt-7 text-lg leading-relaxed text-neutral-600">{item.text}</p>
        <dl className="mt-8 space-y-5">
          {[["Цель", example.goal], ["Моя роль", example.role], ["Что приложить", example.evidence]].map(([label, text]) => (
            <div key={label}>
              <dt className="text-lg font-semibold text-brand-950">{label}</dt>
              <dd className="mt-2 text-lg leading-relaxed text-neutral-600">{text}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="flex flex-col border-t border-brand-100 px-6 py-8 sm:px-10 sm:py-10 lg:border-t-0 lg:pl-12">
        <div className="flex items-center justify-between border-b border-brand-100 pb-4 text-xs tracking-widest text-neutral-400 uppercase">
          <span>Примеры и материалы</span><span className="tabular-nums">{String(active * 2 + 2).padStart(2, "0")}</span>
        </div>
        <figure className="mt-8">
          <div className="relative rotate-1 border border-neutral-200 bg-white p-2 shadow-md">
            <span aria-hidden="true" className="absolute -top-3 left-1/2 z-10 h-6 w-20 -translate-x-1/2 -rotate-6 bg-amber-100/80" />
            <div className="relative aspect-4/3 overflow-hidden bg-brand-50 lg:aspect-video">
              <Image src={item.image} alt={`Иллюстрация раздела «${example.tab}»`} fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />
            </div>
          </div>
          <figcaption className="mt-5 text-lg leading-relaxed text-neutral-500">{sample.caption}</figcaption>
        </figure>
        <div className="mt-7 border-t border-dashed border-brand-200 pt-5">
          <p className="text-lg font-semibold text-brand-950">Моя работа и выводы</p>
          <p className="mt-2 text-lg leading-relaxed text-neutral-600">{sample.reflection}</p>
          <p className="mt-3 text-xs text-neutral-400">Учебный пример текста; фото иллюстративное.</p>
        </div>
      </div>
    </div>
  );
}
