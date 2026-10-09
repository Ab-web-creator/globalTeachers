"use client";

import { JobSearchIcon, type GuideIconName } from "@/app/components/svg";
import { useEffect, useState } from "react";
import SectionHeading from "../section-heading";
import { searchTiming, searchTimingIntroduction } from "./content";
import SectionLabel from "./section-label";

type SeasonName = "fall" | "winter" | "spring" | "summer";

const falling: Record<"fall" | "winter", {
  icon: GuideIconName;
  motion: string;
  pieces: {
    left: string;
    delay: string;
    duration: string;
    drift: string;
    size: string;
  }[];
}> = {
  fall: {
    icon: "leaf",
    motion: "season-fall",
    pieces: [
      { left: "74%", delay: "0s", duration: "4.6s", drift: "1.4rem", size: "size-16" },
      { left: "90%", delay: "1.1s", duration: "5.2s", drift: "-1rem", size: "size-12" },
      { left: "58%", delay: "1.5s", duration: "4.2s", drift: "2rem", size: "size-20" },
      { left: "81%", delay: "3.2s", duration: "4.4s", drift: "-1.6rem", size: "size-14" },
      { left: "66%", delay: "3.6s", duration: "4.8s", drift: "0.4rem", size: "size-16" },
      { left: "95%", delay: "4s", duration: "3.6s", drift: "-2rem", size: "size-12" },
    ],
  },
  winter: {
    icon: "snowflake",
    motion: "season-snow",
    pieces: [
      { left: "70%", delay: "0s", duration: "5.4s", drift: "0.6rem", size: "size-10" },
      { left: "88%", delay: "0.9s", duration: "4.8s", drift: "-1.1rem", size: "size-8" },
      { left: "54%", delay: "1.3s", duration: "6s", drift: "1.4rem", size: "size-12" },
      { left: "79%", delay: "2.9s", duration: "4.4s", drift: "-0.4rem", size: "size-10" },
      { left: "63%", delay: "3.4s", duration: "5.2s", drift: "1rem", size: "size-8" },
      { left: "94%", delay: "3.8s", duration: "4s", drift: "-1.5rem", size: "size-12" },
    ],
  },
};

const blooms = ["top-6 right-8", "top-1/4 right-1/4", "top-1/2 right-12", "bottom-1/4 right-1/3", "bottom-6 right-1/6"];

const icons: GuideIconName[] = ["leaf", "snowflake", "flower", "sun"];

const lastIndex = searchTiming.length - 1;

const columns = ["md:col-start-1", "md:col-start-2", "md:col-start-3", "md:col-start-4"];

const seasons: SeasonName[] = ["fall", "winter", "spring", "summer"];

const seasonMs = 8000;

const pauseMs = 2000;

export default function SearchTiming() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches)
      return;
    let timeout = 0;
    let cancelled = false;
    function play(index: number) {
      if (cancelled)
        return;
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
    <section aria-labelledby="search-timing" className="py-12 sm:py-16 lg:py-20">
      {playing && <SeasonEffect season={seasons[active]} />}
      <div className="relative grid items-start gap-10 xl:grid-cols-3 xl:gap-12">
        <div>
          <SectionLabel>Когда начинать поиск?</SectionLabel>
          <SectionHeading id="search-timing">Лучшее время для поиска</SectionHeading>
          <p className="mt-7 leading-relaxed text-neutral-600">{searchTimingIntroduction}</p>
        </div>
        <div className="min-w-0 xl:col-span-2">
          <SeasonTimeline active={active} playing={playing} />
        </div>
      </div>
    </section>
  );
}

function SeasonEffect({ season }: {
  season: SeasonName;
}) {
  return (
    <div aria-hidden="true" className="season-effects pointer-events-none absolute inset-0 overflow-hidden text-white/80">
      {(season === "fall" || season === "winter") && falling[season].pieces.map(piece => (<span key={`${piece.left}-${piece.delay}`} className={`absolute ${falling[season].motion}`} style={{ left: piece.left, ["--fall-delay" as string]: piece.delay, ["--fall-duration" as string]: piece.duration, ["--drift" as string]: piece.drift }}>
        <JobSearchIcon name={falling[season].icon} className={piece.size} />
      </span>))}
      {season === "spring" && blooms.map((place, index) => (<span key={place} className={`absolute ${place} season-bloom`} style={{ animationDelay: `${index * 0.25}s` }}>
        <JobSearchIcon name="flower" className="size-16" />
      </span>))}
      {season === "summer" && (<span className="absolute top-4 right-4 grid size-32 place-items-center sm:top-6 sm:right-6">
        <span className="season-glow absolute inset-0 rounded-full bg-white/40" />
        <JobSearchIcon name="sun" className="season-sun relative size-28" />
      </span>)}
    </div>
  );
}

function SeasonTimeline({ active, playing }: {
  active: number;
  playing: boolean;
}) {
  return (
    <div className="pb-4">
      <ol className="grid md:grid-cols-4">
        {searchTiming.map(({ period, text }, index) => {
          const last = index === lastIndex;
          return (
            <li key={period} className="relative flex min-w-0 gap-4 pb-8 last:pb-0 md:contents">
              {!last && <span aria-hidden="true" className="absolute top-16 bottom-0 left-8 w-px -translate-x-1/2 bg-brand-300 md:hidden" />}
              <div className={`relative grid size-16 shrink-0 place-items-center rounded-full border-4 border-brand-300/20 text-brand-500 md:row-start-1 md:justify-self-center ${columns[index]}`}>
                <JobSearchIcon name={icons[index]} className="size-8" />
              </div>
              <div aria-hidden="true" className={`relative hidden justify-center py-5 md:row-start-2 md:flex ${columns[index]}`}>
                <span className={`absolute top-1/2 h-px bg-brand-300 ${index === 0 ? "left-1/2" : "left-0"} ${last ? "right-1/2" : "right-0"}`} />
                <span className="relative size-3 rounded-full bg-brand-500" />
              </div>
              <div className="min-w-0 pt-3 md:contents">
                <span className={`inline-block rounded-full bg-brand-300/20 px-3 py-2 text-sm font-medium text-brand-600 md:row-start-3 md:justify-self-center ${columns[index]} ${playing && index === active ? "period-blink" : ""}`}>{period}</span>
                <p className={`mt-3 text-base leading-relaxed text-neutral-600 md:row-start-4 md:mt-5 md:px-4 md:text-center ${columns[index]}`}>{text}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
