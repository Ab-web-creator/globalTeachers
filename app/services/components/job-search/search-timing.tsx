"use client";

import { useEffect, useState } from "react";
import { searchTiming, searchTimingIntroduction } from "./content";
import SeasonEffect, { type SeasonName } from "./season-effect";

const seasons: SeasonName[] = ["fall", "winter", "spring", "summer"];
const seasonMs = 8000;
const pauseMs = 2000;

export default function SearchTiming() {
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
        timeout = window.setTimeout(() => play((index + 1) % searchTiming.length), pauseMs);
      }, seasonMs);
    }

    play(0);
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, []);

  return (
    <section aria-labelledby="search-timing" className="relative overflow-hidden">
      {playing && <SeasonEffect season={seasons[active]} />}
      <div className="relative">
        <h2 id="search-timing" className="text-2xl font-semibold tracking-tight sm:text-3xl">Когда начинать поиск?</h2>
        <p className="mt-4 leading-relaxed text-neutral-600">{searchTimingIntroduction}</p>
        <ol className="mt-8">
          {searchTiming.map(({ period, text }, index) => (
            <li key={period} className="flex gap-4">
              <span className="flex w-3 shrink-0 flex-col items-center">
                <span aria-hidden="true" className={`w-px flex-1 ${index > 0 ? "bg-brand-300" : ""}`} />
                <span aria-hidden="true" className="size-3 shrink-0 rounded-full bg-brand-500" />
                <span aria-hidden="true" className={`w-px flex-1 ${index < searchTiming.length - 1 ? "bg-brand-300" : ""}`} />
              </span>
              <div className="flex min-w-0 flex-1 items-center gap-4 py-2.5">
                <span className={`w-fit shrink-0 rounded-full bg-brand-300/20 px-4 py-2 text-sm font-medium ${playing && index === active ? "period-blink" : ""}`}>{period}</span>
                <p className="text-sm leading-relaxed text-neutral-600">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
