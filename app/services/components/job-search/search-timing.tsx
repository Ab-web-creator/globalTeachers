"use client";

import SectionLabel from "./section-label";

import { useEffect, useState } from "react";
import { searchTiming, searchTimingIntroduction } from "./content";
import SeasonEffect, { type SeasonName } from "./season-effect";
import SeasonTimeline from "./season-timeline";

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
      <div className="relative grid items-start gap-10 xl:grid-cols-3 xl:gap-12">
        <div>
          <SectionLabel>Когда начинать поиск?</SectionLabel>
          <h2 id="search-timing" className="text-3xl font-semibold tracking-tight sm:text-4xl">Лучшее время для поиска</h2>
          <p className="mt-5 leading-relaxed text-neutral-600">{searchTimingIntroduction}</p>
        </div>
        <div className="min-w-0 xl:col-span-2">
          <SeasonTimeline active={active} playing={playing} />
        </div>
      </div>
    </section>
  );
}
