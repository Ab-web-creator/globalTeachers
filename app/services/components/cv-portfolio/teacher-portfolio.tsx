"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import { useEffect } from "react";
import useStagePreview from "../use-stage-preview";
import previewStyles from "../vertical-stage-tabs.module.css";
import Image from "next/image";
import { BackLinkArrowIcon } from "@/app/components/svg";
import SectionLabel from "../job-search/section-label";
import SectionHeading from "../section-heading";
import { portfolioItems } from "./content";
import { portfolioExamples } from "./portfolio-examples";
import PortfolioSpread from "./portfolio-spread";
import SectionFade from "./section-fade";

export default function TeacherPortfolio() {
  const t = useTranslations();
  const count = portfolioExamples.length;
  const { container, active, exiting, select, stopPreview } = useStagePreview(true, count);

  useEffect(() => {
    let origin: { x: number; y: number } | undefined;
    function trackMouse(event: PointerEvent) {
      if (event.pointerType !== "mouse" || !container.current) return;
      const bounds = container.current.getBoundingClientRect();
      if (bounds.top >= window.innerHeight || bounds.bottom <= 0) {
        origin = undefined;
        return;
      }
      if (!origin) {
        origin = { x: event.clientX, y: event.clientY };
        return;
      }
      if (Math.hypot(event.clientX - origin.x, event.clientY - origin.y) >= 80) stopPreview();
    }
    window.addEventListener("pointermove", trackMouse, { passive: true });
    return () => window.removeEventListener("pointermove", trackMouse);
  }, [container, stopPreview]);

  return (
    <section aria-labelledby="teacher-portfolio" className="relative isolate py-12 sm:py-16 lg:py-20">
      <SectionFade direction="down" halfHeight />
      <div>
        <SectionLabel>{t("services.cvPortfolio.teacherPortfolio.message1558")}</SectionLabel>
        <SectionHeading id="teacher-portfolio">{t("services.cvPortfolio.teacherPortfolio.message1559")}</SectionHeading>
        <div className="mt-7 max-w-[55ch] space-y-4 text-lg leading-relaxed text-neutral-600">
          <p>{t("services.cvPortfolio.teacherPortfolio.message1560")}</p>
        </div>
      </div>
      <ul className="mt-10 space-y-6 sm:hidden">
        {portfolioItems.map(({ title, text, image }) => (
          <li key={title} className="overflow-hidden rounded-3xl border border-brand-100 bg-white">
            <div className="relative aspect-video">
              <Image src={image} alt="" fill sizes="100vw" className={`object-cover ${image === "/images/portfolio/achievements-teacher.webp" || image === "/images/portfolio/leadership.webp" ? "object-top" : ""}`} />
            </div>
            <div className="p-5">
              <h3 className="text-xl font-semibold leading-snug">{t.content(title)}</h3>
              <p className="mt-3 text-base leading-relaxed text-neutral-600">{t.content(text)}</p>
            </div>
          </li>
        ))}
      </ul>
      <div ref={container} onFocusCapture={stopPreview} onPointerDownCapture={stopPreview} className="mt-10 hidden sm:block">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-widest text-brand-600 uppercase">{t("services.cvPortfolio.teacherPortfolio.message1561")}</p>
            <p className="mt-2 text-sm text-neutral-500">{t("services.cvPortfolio.teacherPortfolio.message1562")}</p>
          </div>
          <p className="text-sm tabular-nums text-neutral-500">{t("services.cvPortfolio.teacherPortfolio.message1563")}{" "}{active + 1} {" "}{t("client.clientFiles.message0105")}{" "}{count}</p>
        </div>
        <div className="relative mt-6 rounded-2xl border border-brand-200 bg-brand-100 p-2 shadow-sm sm:p-3">
          <div className="flex flex-col items-stretch gap-3 pb-2 sm:flex-row sm:items-start">
          <div role="tablist" aria-label={t("services.cvPortfolio.teacherPortfolio.message1564")} onPointerEnter={stopPreview} className="grid min-w-0 grid-cols-2 gap-2 sm:flex sm:flex-1 sm:flex-wrap">
            {portfolioExamples.map(({ tab }, index) => (<button key={tab} type="button" role="tab" id={`portfolio-tab-${index}`} aria-selected={active === index} aria-controls="portfolio-spread" onClick={() => select(index)} className={`rounded-lg border px-2 py-2 text-sm font-medium sm:rounded-none sm:rounded-t-lg sm:px-4 transition-colors ${active === index ? "border-white bg-white text-brand-600" : "border-brand-200 bg-brand-50 text-neutral-600 hover:bg-white"}`}>
              {t.content(tab)}
            </button>))}
          </div>
          <div onPointerEnter={stopPreview} className="flex shrink-0 justify-between gap-2 sm:ml-auto sm:justify-start">
            <button type="button" aria-label={t("services.cvPortfolio.teacherPortfolio.message1565")} aria-controls="portfolio-spread" onClick={() => select((active + count - 1) % count)} className="group inline-flex items-center gap-1 rounded-xl bg-white/90 py-1 pr-4 pl-1 text-sm text-brand-500 shadow-sm">
              <span className="flex size-8 items-center justify-center rounded-full transition-colors duration-200 motion-reduce:transition-none group-hover:bg-neutral-200 group-hover:text-brand-600">
                <BackLinkArrowIcon />
              </span>
              {t("home.siteHeader.message0455")}</button>
            <button type="button" aria-label={t("services.cvPortfolio.teacherPortfolio.message1566")} aria-controls="portfolio-spread" onClick={() => select((active + 1) % count)} className="group inline-flex items-center gap-1 rounded-xl bg-white/90 py-1 pr-1 pl-4 text-sm text-brand-500 shadow-sm">
              {t("consultation.formNavigation.message0572")}<span className="flex size-8 items-center justify-center rounded-full transition-colors duration-200 motion-reduce:transition-none group-hover:bg-neutral-200 group-hover:text-brand-600">
                <BackLinkArrowIcon className="rotate-180" />
              </span>
            </button>
          </div>
          </div>
          <div role="tabpanel" id="portfolio-spread" aria-labelledby={`portfolio-tab-${active}`}>
            <div key={active} className={exiting ? previewStyles.exiting : previewStyles.content}>
              <PortfolioSpread active={active} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
