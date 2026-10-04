"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";
import CarouselButton from "./carousel-button";
import { playClick } from "./click-sound";
import { portfolioItems } from "./content";

const stepMs = 3000;
const count = portfolioItems.length;

// Distance from the open card, wrapped so cards sit on both sides (-3…4).
function offsetFrom(index: number, active: number) {
  const offset = (index - active + count) % count;
  return offset > count / 2 ? offset - count : offset;
}

function cardStyle(offset: number) {
  return { "--offset": offset, "--scale": offset === 0 ? 1 : 0.9, "--opacity": offset === 0 ? 1 : 0.5 } as CSSProperties;
}

export default function PortfolioItems() {
  const [{ active, previous }, setSlide] = useState({ active: 0, previous: 0 });
  const [autoplay, setAutoplay] = useState(true);

  function move(step: 1 | -1) {
    setSlide(({ active }) => ({ active: (active + step + count) % count, previous: active }));
  }

  useEffect(() => {
    if (!autoplay || window.matchMedia("(prefers-reduced-motion: reduce), (min-width: 1024px)").matches) return;
    const timer = window.setInterval(() => move(1), stepMs);
    return () => window.clearInterval(timer);
  }, [autoplay]);

  function go(step: 1 | -1) {
    setAutoplay(false);
    playClick();
    move(step);
  }

  return (
    <div className="mt-10">
      <ul className="relative h-112 overflow-hidden lg:grid lg:h-auto lg:grid-cols-3 lg:gap-6 xl:grid-cols-4 lg:overflow-visible">
        {portfolioItems.map(({ title, text, image }, index) => {
          const offset = offsetFrom(index, active);
          const open = offset === 0;
          // A card wrapping round from one end to the other jumps off-screen instead of sliding across.
          const wrapped = Math.abs(offset - offsetFrom(index, previous)) > 1;

          return (
            <li
              key={title}
              style={cardStyle(offset)}
              className={`group max-lg:absolute max-lg:top-2 max-lg:left-1/2 max-lg:-ml-36 max-lg:w-72 max-lg:opacity-(--opacity) max-lg:transform-[translateX(calc(var(--offset)*(100%_+_1rem)))_scale(var(--scale))] ${wrapped ? "" : "transition-[transform,opacity] duration-500 ease-out motion-reduce:transition-none"}`}
            >
              <div className={`flex aspect-2/3 h-full flex-col rounded-2xl border bg-white p-3 transition-[translate,box-shadow,border-color] duration-200 hover:border-brand-400 hover:shadow-xl hover:shadow-brand-500/15 motion-safe:hover:-translate-y-1 motion-reduce:transition-none lg:aspect-auto ${open ? "border-brand-500 shadow-xl shadow-brand-500/20 lg:border-brand-300 lg:shadow-lg lg:shadow-neutral-900/10 lg:hover:border-brand-400 lg:hover:shadow-xl lg:hover:shadow-brand-500/15" : "border-brand-300 shadow-lg shadow-neutral-900/10"}`}>
                <div className="relative min-h-32 flex-1 overflow-hidden rounded-xl lg:h-48 lg:flex-none">
                  <Image src={image} alt="" fill sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 288px" className="object-cover transition-transform duration-300 ease-out motion-safe:group-hover:scale-105 motion-reduce:transition-none" />
                </div>
                <div className="px-3 pt-4 pb-3">
                  <p className="text-base font-semibold leading-snug text-brand-950">{title}</p>
                  <p className="mt-2 text-base leading-relaxed text-neutral-600">{text}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-6 flex justify-center gap-3 lg:hidden">
        <CarouselButton direction="prev" onClick={() => go(-1)} />
        <CarouselButton direction="next" onClick={() => go(1)} />
      </div>
    </div>
  );
}
