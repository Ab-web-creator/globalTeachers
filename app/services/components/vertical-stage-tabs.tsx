"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import LineIcon from "./line-icon";

type Stage = {
  id: string;
  title: string;
  paragraphs: readonly string[];
  closing?: string;
};

type Props = {
  id: string;
  label: string;
  labels: readonly string[];
  paths: readonly string[];
  stages: readonly Stage[];
};

export default function VerticalStageTabs({ id, label, labels, paths, stages }: Props) {
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === "ArrowDown") next = (index + 1) % labels.length;
    else if (event.key === "ArrowUp") next = (index + labels.length - 1) % labels.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = labels.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    buttons.current[next]?.focus();
  }

  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3 sm:gap-4">
      <div role="tablist" aria-label={label} aria-orientation="vertical" className="flex flex-col gap-2 rounded-2xl border border-brand-100 bg-brand-50/60 p-2 sm:w-48 lg:w-52">
        {labels.map((label, index) => (
          <button key={label} ref={(element) => { buttons.current[index] = element; }} type="button" role="tab" id={`${id}-tab-${index}`} aria-selected={active === index} aria-controls={`${id}-panel-${index}`} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={(event) => navigate(event, index)} className={`flex flex-col items-center gap-2 rounded-xl px-3 py-4 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 sm:flex-row sm:gap-3 sm:text-base lg:px-5 lg:text-lg ${active === index ? "bg-brand-500 text-white shadow-sm" : "text-neutral-600 hover:bg-white hover:text-brand-600"}`}>
            <LineIcon path={paths[index]} className="size-5 shrink-0 sm:size-6" />
            {label}
          </button>
        ))}
      </div>
      {stages.map((stage, index) => (
        <div key={stage.id} role="tabpanel" id={`${id}-panel-${index}`} aria-labelledby={`${id}-tab-${index}`} hidden={active !== index} tabIndex={0} className="min-w-0 rounded-3xl border border-brand-100 bg-linear-to-br from-white to-sky-50/50 p-4 focus-visible:outline-2 focus-visible:outline-brand-500 sm:p-6">
          <div>
            <div>
              <p className="mb-4 text-sm font-medium tracking-widest text-brand-400">0{index + 1} / {String(stages.length).padStart(2, "0")}</p>
              <h3 className="text-xl font-semibold leading-snug tracking-tight text-brand-950 sm:text-2xl">{stage.title}</h3>
            </div>
            <div className="mt-4">
              <div className="space-y-3 text-base leading-relaxed text-neutral-600">
                {stage.paragraphs.map((text) => <p key={text}>{text}</p>)}
              </div>
              {stage.closing && <p className="mt-5 border-l-2 border-brand-300 pl-4 text-base font-semibold leading-relaxed text-brand-600">{stage.closing}</p>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
