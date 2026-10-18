"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import { useState } from "react";
import SectionLabel from "../job-search/section-label";
import SectionHeading from "../section-heading";
import { cvSections } from "./content";
import CvSketch from "./cv-sketch";
import SectionFade from "./section-fade";

export default function CvStructure() {
  const t = useTranslations();
  const [active, setActive] = useState(0);

  return (
    <section aria-labelledby="cv-structure" className="relative isolate py-12 sm:py-16 lg:py-20">
      <SectionFade />
      <SectionLabel>{t("services.cvPortfolio.cvStructure.message1481")}</SectionLabel>
      <SectionHeading id="cv-structure">{t("services.cvPortfolio.cvStructure.message1482")}</SectionHeading>
      <p className="mt-7 max-w-lg text-lg leading-relaxed text-neutral-600">{t("services.cvPortfolio.cvStructure.message1483")}</p>
      <div className="mt-10 grid gap-8 lg:grid-cols-5 lg:gap-12">
        <div className="space-y-4 lg:col-span-3">
          {cvSections.map(({ title, text }, index) => (<CvSectionCard key={title} number={index + 1} title={t.content(title)} text={text} active={index === active} onActivate={() => setActive(index)} />))}
        </div>
        <div className="hidden lg:col-span-2 lg:block">
          <div className="sticky top-24">
            <CvSketch labels={cvSections.map(({ label }) => label)} active={active} />
          </div>
        </div>
      </div>
    </section>
  );
}

function CvSectionCard({ number, title, text, active, onActivate }: {
  number: number;
  title: string;
  text: string;
  active: boolean;
  onActivate: () => void;
}) {
  const t = useTranslations();
  return (
    <div tabIndex={0} onMouseEnter={onActivate} onFocus={onActivate} className={`flex items-start gap-5 rounded-3xl border border-brand-100 bg-white p-4 transition-colors outline-none sm:p-5 ${active ? "sm:border-brand-300 sm:shadow-lg sm:shadow-brand-500/10" : ""}`}>
      <span className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold tabular-nums bg-brand-50 text-brand-600 transition-colors ${active ? "sm:bg-brand-500 sm:text-white" : ""}`}>{t.content(String(number).padStart(2, "0"))}</span>
      <div className="min-w-0">
        <h3 className="text-lg leading-tight font-semibold sm:leading-7">{t.content(title)}</h3>
        <p className="mt-3 max-w-lg leading-relaxed text-neutral-600">{t.content(text)}</p>
      </div>
    </div>
  );
}
