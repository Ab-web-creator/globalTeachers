"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import LineIcon from "./line-icon";
import useStagePreview from "./use-stage-preview";
import styles from "./vertical-stage-tabs.module.css";

type Stage = {
  id: string;
  title: string;
  paragraphs: readonly string[];
  closing?: string;
};

type Props = {
  id: string;
  autoPreview?: boolean;
  label: string;
  labels: readonly string[];
  paths: readonly string[];
  stages: readonly Stage[];
};

export default function VerticalStageTabs({ id, label, labels, paths, stages, autoPreview = false }: Props) {
  const { container, active, exiting, select, stopPreview } = useStagePreview(autoPreview, stages.length);
  const [vertical, setVertical] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 640px)");
    const update = () => setVertical(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === (vertical ? "ArrowDown" : "ArrowRight")) next = (index + 1) % labels.length;
    else if (event.key === (vertical ? "ArrowUp" : "ArrowLeft")) next = (index + labels.length - 1) % labels.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = labels.length - 1;
    else return;
    event.preventDefault();
    select(next);
    buttons.current[next]?.focus();
  }

  return (
    <div ref={container} onFocusCapture={stopPreview} onPointerDownCapture={stopPreview} className="grid grid-cols-1 items-start sm:grid-cols-[auto_minmax(0,1fr)]">
      <div role="tablist" aria-label={label} aria-orientation={vertical ? "vertical" : "horizontal"} className="flex gap-2 rounded-t-2xl border border-b-0 border-brand-200 bg-brand-50 px-2 pt-2 sm:w-48 sm:flex-col sm:rounded-t-none sm:rounded-l-2xl sm:border-r-0 sm:border-b sm:py-2 sm:pr-0 lg:w-52">
        {labels.map((label, index) => (
          <button key={label} ref={(element) => { buttons.current[index] = element; }} type="button" role="tab" id={`${id}-tab-${index}`} aria-selected={active === index} aria-controls={`${id}-panel-${index}`} tabIndex={active === index ? 0 : -1} onClick={() => select(index)} onKeyDown={(event) => navigate(event, index)} className={`relative flex min-w-0 flex-1 flex-col items-center gap-2 rounded-t-xl border px-2 py-4 sm:flex-none sm:rounded-t-none sm:rounded-l-xl sm:px-3 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 sm:flex-row sm:gap-3 sm:text-base lg:px-5 lg:text-lg ${active === index ? "z-10 -mb-px border-brand-200 border-b-white bg-white text-brand-600 sm:mb-0 sm:-mr-px sm:border-r-white sm:border-b-brand-200" : "mb-2 border-transparent bg-brand-100 sm:mb-0 sm:mr-2 text-neutral-600 hover:bg-brand-200 hover:text-brand-600"}`}>
            <LineIcon path={paths[index]} className="size-5 shrink-0 sm:size-6" />
            {label}
          </button>
        ))}
      </div>
      {stages.map((stage, index) => (
        <div key={stage.id} role="tabpanel" id={`${id}-panel-${index}`} aria-labelledby={`${id}-tab-${index}`} hidden={active !== index} tabIndex={0} className="min-w-0 rounded-b-3xl sm:rounded-r-3xl border border-brand-200 bg-white p-4 focus-visible:outline-2 focus-visible:outline-brand-500 sm:p-6">
          <div key={active} className={autoPreview ? (exiting ? styles.exiting : styles.content) : undefined}>
            <div>
              <p className="mb-4 text-sm font-medium tracking-widest text-brand-400">0{index + 1} / {String(stages.length).padStart(2, "0")}</p>
              <h3 className="text-xl font-semibold leading-snug tracking-tight text-brand-950 sm:text-2xl">{stage.title}</h3>
            </div>
            <div className="mt-4">
              <div className="space-y-3 text-lg leading-relaxed text-neutral-600">
                {stage.paragraphs.map((text) => <p key={text}>{text}</p>)}
              </div>
              {stage.closing && <p className="mt-5 border-l-2 border-brand-300 pl-4 text-lg font-semibold leading-relaxed text-brand-600">{stage.closing}</p>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
