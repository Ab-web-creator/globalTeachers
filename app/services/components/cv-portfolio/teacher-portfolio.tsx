"use client";

import { useState } from "react";
import { BackLinkArrowIcon } from "@/app/components/svg";
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
        <div className="mt-7 max-w-[55ch] space-y-4 text-lg leading-relaxed text-neutral-600">
          <p>Портфолио дополняет CV и позволяет показать вашу работу более наглядно. Оно особенно полезно, если вы можете показать результат своей работы, а не только рассказать о нём. В него могут входить:</p>
        </div>
      </div>
      <div className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-widest text-brand-600 uppercase">Пример портфолио</p>
            <p className="mt-2 text-sm text-neutral-500">Откройте раздел и посмотрите, как можно представить свою работу.</p>
          </div>
          <p className="text-sm tabular-nums text-neutral-500">Раздел {active + 1} из {count}</p>
        </div>
        <div className="relative mt-6 rounded-2xl border border-brand-200 bg-brand-100 p-2 shadow-sm sm:p-3">
          <div className="flex items-start gap-3 pb-2">
          <div role="tablist" aria-label="Разделы портфолио" className="flex min-w-0 flex-1 flex-wrap gap-2">
            {portfolioExamples.map(({ tab }, index) => (<button key={tab} type="button" role="tab" id={`portfolio-tab-${index}`} aria-selected={active === index} aria-controls="portfolio-spread" onClick={() => setActive(index)} className={`rounded-t-lg border px-4 py-2 text-sm font-medium transition-colors ${active === index ? "border-white bg-white text-brand-600" : "border-brand-200 bg-brand-50 text-neutral-600 hover:bg-white"}`}>
              {tab}
            </button>))}
          </div>
          <div className="ml-auto flex shrink-0 gap-2">
            <button type="button" aria-label="Предыдущий раздел" aria-controls="portfolio-spread" onClick={() => setActive((active + count - 1) % count)} className="group inline-flex items-center gap-1 rounded-xl bg-white/90 py-1 pr-4 pl-1 text-sm text-brand-500 shadow-sm">
              <span className="flex size-8 items-center justify-center rounded-full transition-colors duration-200 motion-reduce:transition-none group-hover:bg-neutral-200 group-hover:text-brand-600">
                <BackLinkArrowIcon />
              </span>
              Назад
            </button>
            <button type="button" aria-label="Следующий раздел" aria-controls="portfolio-spread" onClick={() => setActive((active + 1) % count)} className="group inline-flex items-center gap-1 rounded-xl bg-white/90 py-1 pr-1 pl-4 text-sm text-brand-500 shadow-sm">
              Далее
              <span className="flex size-8 items-center justify-center rounded-full transition-colors duration-200 motion-reduce:transition-none group-hover:bg-neutral-200 group-hover:text-brand-600">
                <BackLinkArrowIcon className="rotate-180" />
              </span>
            </button>
          </div>
          </div>
          <div role="tabpanel" id="portfolio-spread" aria-labelledby={`portfolio-tab-${active}`}>
            <PortfolioSpread active={active} />
          </div>
        </div>
      </div>
    </section>
  );
}
