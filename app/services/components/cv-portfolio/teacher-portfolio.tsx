"use client";

import { useState } from "react";
import SectionLabel from "../job-search/section-label";
import SectionHeading from "../section-heading";
import { portfolioExamples } from "./portfolio-examples";
import PortfolioSpread from "./portfolio-spread";
import SectionFade from "./section-fade";

export default function TeacherPortfolio() {
  const [active, setActive] = useState(0);
  const count = portfolioExamples.length;

  return (
    <section aria-labelledby="teacher-portfolio" className="relative isolate py-12 sm:py-16 lg:py-20">
      <SectionFade direction="down" halfHeight />
      <div>
        <SectionLabel>Портфолио</SectionLabel>
        <SectionHeading id="teacher-portfolio">А что такое Teacher Portfolio?</SectionHeading>
        <p className="mt-7 max-w-2xl text-lg leading-relaxed text-neutral-600">Портфолио дополняет CV и позволяет показать вашу работу более наглядно. Оно особенно полезно, если вы можете показать результат своей работы, а не только рассказать о нём. В него могут входить:</p>
      </div>
      <div className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-widest text-brand-600 uppercase">Пример портфолио</p>
            <p className="mt-2 text-sm text-neutral-500">Откройте раздел и посмотрите, как можно представить свою работу.</p>
          </div>
          <p className="text-sm tabular-nums text-neutral-500">Раздел {active + 1} из {count}</p>
        </div>
        <div className="mt-6 rounded-2xl border border-brand-200 bg-brand-100 p-3 shadow-sm sm:p-5">
          <div role="tablist" aria-label="Разделы портфолио" className="flex flex-wrap gap-2 pb-4">
            {portfolioExamples.map(({ tab }, index) => (<button key={tab} type="button" role="tab" id={`portfolio-tab-${index}`} aria-selected={active === index} aria-controls="portfolio-spread" onClick={() => setActive(index)} className={`rounded-t-lg border px-4 py-2 text-sm font-medium transition-colors ${active === index ? "border-white bg-white text-brand-600" : "border-brand-200 bg-brand-50 text-neutral-600 hover:bg-white"}`}>
              {tab}
            </button>))}
          </div>
          <div role="tabpanel" id="portfolio-spread" aria-labelledby={`portfolio-tab-${active}`}>
            <PortfolioSpread active={active} />
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between gap-4">
          <button type="button" onClick={() => setActive((active + count - 1) % count)} className="rounded-xl border border-brand-200 px-4 py-3 text-sm font-medium text-brand-600 transition hover:bg-brand-50">← Предыдущий раздел</button>
          <button type="button" onClick={() => setActive((active + 1) % count)} className="rounded-xl border border-brand-200 px-4 py-3 text-sm font-medium text-brand-600 transition hover:bg-brand-50">Следующий раздел →</button>
        </div>
      </div>
    </section>
  );
}
