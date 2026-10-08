"use client";

import { getImageProps } from "next/image";
import { useEffect, useImperativeHandle, useRef, useState, type Ref } from "react";
import HeroAirplanes from "./hero-airplanes";

const slides = [
  { desktop: "/images/hero-campus-new-start.webp", mobile: "/images/hero-campus-new-start.webp", airport: false },
  { desktop: "/images/hero-classroom-discovery.webp", mobile: "/images/hero-classroom-discovery.webp", airport: false },
  { desktop: "/images/hero-airport-family-v2.webp", mobile: "/images/hero-airport-family-mobile.webp", airport: true },
];

export type HeroImageHandle = { next: () => void };

export default function HeroImage({ paused, ref }: { paused: boolean; ref?: Ref<HeroImageHandle> }) {
  const [active, setActive] = useState(0);
  const loaded = useRef(slides.map(() => false));
  const images = useRef<(HTMLImageElement | null)[]>([]);

  useImperativeHandle(ref, () => ({
    next: () => setActive((current) => (current + 1) % slides.length),
  }), []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | undefined;
    function updateTimer() {
      clearInterval(timer);
      if (paused || media.matches || document.hidden) return;
      timer = setInterval(() => {
        setActive((current) => {
          const next = (current + 1) % slides.length;
          const image = images.current[next];
          const ready = loaded.current[next] || Boolean(image?.complete && image.naturalWidth > 0);
          return ready ? next : current;
        });
      }, 7000);
    }
    updateTimer();
    media.addEventListener("change", updateTimer);
    document.addEventListener("visibilitychange", updateTimer);
    return () => {
      clearInterval(timer);
      media.removeEventListener("change", updateTimer);
      document.removeEventListener("visibilitychange", updateTimer);
    };
  }, [paused]);

  return (
    <>
      {slides.map((slide, index) => {
        const common = { alt: "", fill: true, sizes: "100vw", loading: "eager" as const, fetchPriority: index === 0 ? "high" as const : "low" as const };
        const { props: desktop } = getImageProps({ ...common, src: slide.desktop });
        const { props: mobile } = getImageProps({ ...common, src: slide.mobile });
        return (
          <div key={slide.desktop} aria-hidden="true" className={`absolute inset-0 -z-30 transition-opacity duration-1000 motion-reduce:transition-none ${active === index ? "opacity-100" : "opacity-0"}`}>
            <picture>
              <source media="(min-width: 40rem)" srcSet={desktop.srcSet} sizes="100vw" />
              <img {...mobile} alt="" ref={(element) => { images.current[index] = element; }} onLoad={() => { loaded.current[index] = true; }} className={slide.airport ? "-scale-x-100 object-cover object-[80%_center] sm:scale-x-100 sm:object-center lg:object-right" : "object-cover object-[70%_center] sm:object-center lg:object-right"} />
            </picture>
            {slide.airport && <HeroAirplanes />}
          </div>
        );
      })}
    </>
  );
}
