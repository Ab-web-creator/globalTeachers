"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";
import CarouselButton from "./carousel-button";
import { portfolioItems } from "./content";

const stepMs = 3000;
const count = portfolioItems.length;

// Distance from the open card, wrapped so cards sit on both sides (-3…3); the one at 4 hides behind.
function offsetFrom(index: number, active: number) {
  const offset = (index - active + count) % count;
  return offset > count / 2 ? offset - count : offset;
}

function cardStyle(offset: number) {
  const distance = Math.abs(offset);
  const hidden = distance >= count / 2;
  return {
    "--offset": offset,
    "--scale": hidden ? 0.5 : 1 - distance * 0.12,
    "--z": hidden ? 0 : 10 - distance,
    "--opacity": hidden ? 0 : 1,
  } as CSSProperties;
}

export default function PortfolioItems() {
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((index) => (index + 1) % count), stepMs);
    return () => window.clearInterval(timer);
  }, [autoplay]);

  function go(step: 1 | -1) {
    setAutoplay(false);
    setActive((index) => (index + step + count) % count);
  }

  return (
    <div className="mt-8 lg:w-1/2">
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:relative lg:block lg:h-120 lg:overflow-hidden lg:[--step:2.5rem] xl:[--step:4rem] 2xl:[--step:5rem]">
        {portfolioItems.map(({ title, text, image }, index) => {
          const offset = offsetFrom(index, active);
          const open = offset === 0;

          return (
            <li
              key={title}
              style={cardStyle(offset)}
              className="transition-all duration-700 ease-out motion-reduce:transition-none lg:absolute lg:top-0 lg:left-1/2 lg:-ml-40 lg:w-80 lg:z-(--z) lg:opacity-(--opacity) lg:transform-[translateX(calc(var(--offset)*var(--step)))_scale(var(--scale))]"
            >
              <div className={`flex aspect-2/3 flex-col rounded-2xl border bg-white p-3 ${open ? "border-brand-500 shadow-xl shadow-brand-500/20" : "border-brand-300 shadow-lg shadow-neutral-900/10"}`}>
                <div className="relative min-h-32 flex-1 overflow-hidden rounded-xl">
                  <Image src={image} alt="" fill sizes="(min-width: 1024px) 320px, (min-width: 640px) 25vw, 50vw" className="object-cover" />
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
      <div className="mt-8 hidden justify-center gap-3 lg:flex">
        <CarouselButton direction="prev" onClick={() => go(-1)} />
        <CarouselButton direction="next" onClick={() => go(1)} />
      </div>
    </div>
  );
}
