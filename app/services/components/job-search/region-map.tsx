"use client";

import { useEffect, useState } from "react";

const regions = [
  { name: "Северная Америка", label: "left-[6%] top-[14%] w-24", pin: "left-[22%] top-[32%]" },
  { name: "Латинская Америка", label: "left-[2%] top-[58%] w-28", pin: "left-[28%] top-[70%]" },
  { name: "Европа", label: "left-[46%] top-[6%]", pin: "left-[51%] top-[20%]" },
  { name: "Африка", label: "left-[42%] top-[40%]", pin: "left-[50%] top-[52%]" },
  { name: "Ближний Восток", label: "left-[58%] top-[26%] w-28", pin: "left-[58%] top-[40%]" },
  { name: "Азия", label: "left-[78%] top-[28%]", pin: "left-[72%] top-[40%]" },
  { name: "Океания", label: "left-[70%] top-[66%]", pin: "left-[80%] top-[78%]" },
];

const fadeInMs = 500;
const holdMs = 3000;
const fadeOutMs = 1000;
const pauseMs = 1500;

export default function RegionMap() {
  const [lit, setLit] = useState<number | null>(null);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    let timeout = 0;
    let cancelled = false;
    let previous = -1;

    function light() {
      if (cancelled) return;
      let index = Math.floor(Math.random() * regions.length);
      if (index === previous) index = (index + 1) % regions.length;
      previous = index;
      setFadingOut(false);
      setLit(index);
      timeout = window.setTimeout(() => {
        setFadingOut(true);
        setLit(null);
        timeout = window.setTimeout(light, fadeOutMs + pauseMs);
      }, fadeInMs + holdMs);
    }

    timeout = window.setTimeout(light, pauseMs);
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="relative aspect-[95/52] w-full text-brand-300">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle,currentColor_1.1px,transparent_1.3px)] bg-size-[7px_7px] mask-contain mask-center mask-no-repeat [-webkit-mask-image:url(/images/world-map.svg)] [-webkit-mask-position:center] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:contain] [mask-image:url(/images/world-map.svg)]"
      />
      {regions.map(({ name, label, pin }, index) => (
        <span key={name}>
          <span
            className={`absolute ${label} rounded-lg border bg-white px-2 py-1 text-center text-xs font-medium leading-tight transition-[color,border-color,box-shadow] motion-reduce:border-brand-100 motion-reduce:text-brand-600 motion-reduce:shadow-sm motion-reduce:transition-none ${fadingOut ? "duration-1000 ease-in" : "duration-500 ease-out"} ${lit === index ? "border-amber-400 bg-amber-50 text-amber-600 shadow-md shadow-amber-400/70" : "border-brand-100 text-brand-400 shadow-none"}`}
          >
            {name}
          </span>
          <svg viewBox="0 0 24 24" aria-hidden="true" className={`absolute ${pin} size-5 text-brand-500`}>
            <path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
          </svg>
        </span>
      ))}
    </div>
  );
}
