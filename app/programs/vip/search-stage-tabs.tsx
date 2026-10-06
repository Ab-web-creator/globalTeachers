"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import LineIcon from "../../services/components/line-icon";
import { icons } from "../components/icons";
import { searchStages } from "./content";

const labels = ["Вакансии", "Заявки", "Интервью"];
const paths = [icons.search, icons.document, icons.chat];

export default function SearchStageTabs() {
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === "ArrowRight") next = (index + 1) % labels.length;
    else if (event.key === "ArrowLeft") next = (index + labels.length - 1) % labels.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = labels.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    buttons.current[next]?.focus();
  }

  return (
    <div className="mt-10">
      <div role="tablist" aria-label="Этапы поиска" className="grid grid-cols-3 gap-2 rounded-2xl bg-neutral-100 p-2 sm:gap-3">
        {labels.map((label, index) => (
          <button key={label} ref={(element) => { buttons.current[index] = element; }} type="button" role="tab" id={`vip-search-tab-${index}`} aria-selected={active === index} aria-controls={`vip-search-panel-${index}`} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={(event) => navigate(event, index)} className={`flex flex-col items-center justify-center gap-2 rounded-xl px-3 py-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 sm:flex-row sm:gap-3 sm:text-lg ${active === index ? "bg-white text-brand-500 shadow-sm" : "text-neutral-500 hover:bg-white/60 hover:text-brand-600"}`}>
            <LineIcon path={paths[index]} className="size-5 shrink-0 sm:size-6" />
            {label}
          </button>
        ))}
      </div>
      {searchStages.map((stage, index) => (
        <div key={stage.id} role="tabpanel" id={`vip-search-panel-${index}`} aria-labelledby={`vip-search-tab-${index}`} hidden={active !== index} tabIndex={0} className="mt-5 rounded-3xl border border-neutral-200 bg-linear-to-br from-white to-sky-50/50 p-6 focus-visible:outline-2 focus-visible:outline-brand-500 sm:p-10">
          <div className="lg:grid lg:grid-cols-3 lg:gap-12">
            <div>
              <p className="mb-4 text-sm font-medium tracking-widest text-brand-400">0{index + 1} / 03</p>
              <h3 className="max-w-sm text-2xl font-semibold leading-snug tracking-tight text-brand-950">{stage.title}</h3>
            </div>
            <div className="mt-6 lg:col-span-2 lg:mt-0">
              <div className="space-y-4 text-lg leading-relaxed text-neutral-600">
                {stage.paragraphs.map((text) => <p key={text}>{text}</p>)}
              </div>
              <p className="mt-7 border-l-2 border-brand-300 pl-5 text-lg font-semibold leading-relaxed text-brand-600">{stage.closing}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
