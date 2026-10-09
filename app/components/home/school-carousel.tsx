"use client";

import Image from "next/image";
import { useRef } from "react";
import { schoolPartners } from "./school-partners";
import useScrollLogos from "./use-scroll-logos";

export default function SchoolCarousel() {
  const { viewport, track, move } = useScrollLogos();
  const touchStart = useRef<number | null>(null);

  return (
    <div
      ref={viewport}
      id="school-carousel"
      role="region"
      aria-roledescription="карусель"
      aria-labelledby="partners-title"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          move(event.key === "ArrowRight" ? 160 : -160);
        }
      }}
      onTouchStart={(event) => { touchStart.current = event.touches[0].clientX; }}
      onTouchEnd={(event) => {
        if (touchStart.current === null) return;
        const distance = touchStart.current - event.changedTouches[0].clientX;
        if (Math.abs(distance) > 40) move(distance);
        touchStart.current = null;
      }}
      onTouchCancel={() => { touchStart.current = null; }}
      className="mt-5 overflow-hidden rounded-xl touch-pan-y focus-visible:-outline-offset-2 sm:mt-6"
    >
      <div ref={track} className="flex w-max py-2 mix-blend-multiply">
        {[0, 1, 2].map((copy) => (
          <ul key={copy} aria-hidden={copy !== 1 ? true : undefined} aria-label={copy === 1 ? "Логотипы международных школ" : undefined} className="flex shrink-0 items-center gap-4 pr-4 sm:gap-6 sm:pr-6">
            {schoolPartners.map(({ name, image }) => (
              <li key={image} className="relative h-14 w-20 shrink-0 sm:h-24 sm:w-32 lg:w-40">
                <Image src={`/images/collaboration/${image}.jpeg`} alt={copy === 1 ? name : ""} fill sizes="(min-width: 1024px) 160px, (min-width: 640px) 128px, 80px" className="object-contain" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
