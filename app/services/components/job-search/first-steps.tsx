"use client";

import { useEffect, useState } from "react";
import { firstSteps } from "./content";

const stepMs = 8000;
const pauseMs = 2000;

const connectors = [
  { down: "sm:hidden", right: "hidden sm:block" },
  { down: "lg:hidden", right: "hidden lg:block" },
  { down: "sm:hidden lg:block", right: "hidden sm:block lg:hidden" },
  { down: "lg:hidden", right: "hidden lg:block" },
];

function StepArrow({ direction, className, active }: { direction: "down" | "right"; className: string; active: boolean }) {
  const place = direction === "down"
    ? "left-1/2 top-[calc(100%+1rem)] sm:top-[calc(100%+1.5rem)] lg:top-[calc(100%+2rem)]"
    : "top-1/2 left-[calc(100%+1.5rem)] lg:left-[calc(100%+2rem)]";

  return (
    <span aria-hidden="true" className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-brand-200 ${place} ${className} ${active ? "step-arrow-blink" : ""}`}>
      <svg viewBox="0 0 24 24" className={`size-8 ${direction === "down" ? "rotate-90" : ""}`} fill="currentColor"><path d="M8.5 4.5 19 12 8.5 19.5V4.5Z" /></svg>
    </span>
  );
}

export default function FirstSteps() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    let timeout = 0;
    let cancelled = false;

    function play(index: number) {
      if (cancelled) return;
      setActive(index);
      setPlaying(true);
      timeout = window.setTimeout(() => {
        setPlaying(false);
        timeout = window.setTimeout(() => play((index + 1) % firstSteps.length), pauseMs);
      }, stepMs);
    }

    play(0);
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, []);

  return (
    <section aria-labelledby="job-search-first-steps">
      <div className="flex flex-col gap-2">
        <h2 id="job-search-first-steps" className="text-2xl font-semibold tracking-tight sm:text-3xl">С чего начать?</h2>
        <p className="text-sm text-neutral-500 sm:text-base">Пошаговый план, который поможет вам искать вакансии эффективно.</p>
      </div>
      <ol className="mt-8 grid gap-8 sm:grid-cols-2 sm:gap-12 lg:grid-cols-3 lg:gap-16">
        {firstSteps.map(({ title, text }, index) => (
          <li key={title} className="relative">
            {connectors[index] && (
              <>
                <StepArrow direction="down" className={connectors[index].down} active={playing && index === active} />
                <StepArrow direction="right" className={connectors[index].right} active={playing && index === active} />
              </>
            )}
            <div className={`flex h-full items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm ${playing && index === active ? "step-card-blink" : ""}`}>
              <span className={`flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-gray-400 text-sm font-semibold text-gray-400 ${playing && index === active ? "step-number-blink" : ""}`}>{index + 1}</span>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-snug">{title}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-neutral-500">{text}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
