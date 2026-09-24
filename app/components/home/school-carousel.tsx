"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { schoolPartners } from "./school-partners";

export default function SchoolCarousel() {
  const track = useRef<HTMLUListElement>(null);

  const [visibleCount, setVisibleCount] = useState(1);
  const [start, setStart] = useState(0);
  const touchStart = useRef<number | null>(null);

  function advance(direction: number) {
    if (visibleCount < schoolPartners.length) {
      setStart((current) => (current + direction + schoolPartners.length) % schoolPartners.length);
    }
  }

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const resize = new ResizeObserver(([entry]) => {
      const itemWidth = window.innerWidth >= 1024 ? 160 : window.innerWidth >= 640 ? 128 : 112;
      setVisibleCount(Math.max(1, Math.min(schoolPartners.length, Math.floor((entry.contentRect.width + 24) / (itemWidth + 24)))));
    });
    resize.observe(element);
    return () => resize.disconnect();
  }, []);

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const timer = window.setInterval(() => {
      if (document.hidden || reducedMotion.matches || element.matches(":hover, :focus-within")) return;
      if (visibleCount >= schoolPartners.length) return;
      setStart((current) => (current + 1) % schoolPartners.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [visibleCount]);

  const visiblePartners = Array.from({ length: visibleCount }, (_, index) =>
    schoolPartners[((visibleCount === schoolPartners.length ? 0 : start) + index) % schoolPartners.length],
  );

  return (
    <div className="mt-5 sm:mt-6" role="region" aria-roledescription="карусель" aria-labelledby="partners-title">
      <ul
        ref={track}
        id="school-carousel"
        tabIndex={0}
        aria-label="Логотипы международных школ"
        onKeyDown={(event) => {
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            advance(event.key === "ArrowRight" ? 1 : -1);
          }
        }}
        onTouchStart={(event) => { touchStart.current = event.touches[0].clientX; }}
        onTouchEnd={(event) => {
          if (touchStart.current === null) return;
          const distance = touchStart.current - event.changedTouches[0].clientX;
          if (Math.abs(distance) > 40) advance(distance > 0 ? 1 : -1);
          touchStart.current = null;
        }}
        onTouchCancel={() => { touchStart.current = null; }}
        className="flex touch-pan-y items-center justify-between gap-6 rounded-xl py-2"
      >
        {visiblePartners.map(({ name, image }) => (
          <li key={image} className="flex w-28 max-w-full shrink-0 items-center justify-center sm:w-32 lg:w-40">
            <Image
              src={`/images/collaboration/${image}.jpeg`}
              alt={name}
              width={160}
              height={96}
              sizes="(min-width: 1024px) 160px, (min-width: 640px) 128px, 112px"
              className="h-20 w-full object-contain sm:h-24"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
