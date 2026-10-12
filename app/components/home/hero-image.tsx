"use client";

import { markHeroSlidesReady } from "@/app/components/image-schedule";
import { getImageProps } from "next/image";
import { useEffect, useImperativeHandle, useLayoutEffect, useRef, useState, type Ref } from "react";
import { preload } from "react-dom";
import HeroAirplanes from "./hero-airplanes";

const slides = [
  { desktop: "/images/hero-campus-new-start.webp", mobile: "/images/hero-campus-new-start.webp", airport: false },
  { desktop: "/images/hero-classroom-discovery.webp", mobile: "/images/hero-classroom-discovery.webp", airport: false },
  { desktop: "/images/hero-airport-family-v2.webp", mobile: "/images/hero-airport-family-mobile.webp", airport: true },
];

// 24px preview of the first slide, shown blurred while the full photo downloads on slow connections.
const firstSlidePreview = "data:image/webp;base64,UklGRs4AAABXRUJQVlA4IMIAAABwBACdASoYAA4APtFUo0uoJKMhsAgBABoJZgCdMoAlpxfVxZ+ESRyHK5DxcAD+8Af3zIQqLUW8cDjDRHd8c46xgdWQineSSbwiEdO3Qh3JyRoxHC5Hb5ft6v46GaMOn9XOFuGhr3iZTTVLjDNFnQx7y2SXQAOH4eJ8uIl7xvOXyrG+WsUbCc7lr7uPkXsCKAiSOf+fnQ+7IJVcnbdJUTn//sqJUY/sAOczM2sf3PI5fU3RkWlChOf1X7KReL1FWV0AAA==";

export type HeroImageHandle = { next: () => void };

export default function HeroImage({ paused, ref }: { paused: boolean; ref?: Ref<HeroImageHandle> }) {
  const [active, setActive] = useState(0);
  const [showFollowers, setShowFollowers] = useState(false);
  const [canRotate, setCanRotate] = useState(false);
  const loaded = useRef(slides.map(() => false));
  const images = useRef<(HTMLImageElement | null)[]>([]);

  function noteLoaded(index: number) {
    if (loaded.current[index]) return;
    loaded.current[index] = true;
    if (index === 0) setShowFollowers(true);
    if (loaded.current.every(Boolean)) {
      setCanRotate(true);
      markHeroSlidesReady();
    }
  }

  useImperativeHandle(ref, () => ({
    next: () => setActive((current) => {
      const next = (current + 1) % slides.length;
      return loaded.current[next] ? next : current;
    }),
  }), []);

  useLayoutEffect(() => {
    images.current.forEach((image, index) => {
      if (image?.complete && image.naturalWidth > 0) noteLoaded(index);
    });
  }, [showFollowers]);

  useEffect(() => {
    if (!canRotate) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | undefined;
    function updateTimer() {
      clearInterval(timer);
      if (paused || media.matches || document.hidden) return;
      timer = setInterval(() => {
        setActive((current) => (current + 1) % slides.length);
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
  }, [paused, canRotate]);

  return (
    <>
      {slides.map((slide, index) => {
        if (index > 0 && !showFollowers) return null;
        const common = { alt: "", fill: true, sizes: "100vw", loading: "eager" as const, fetchPriority: index === 0 ? "high" as const : "low" as const };
        const { props: desktop } = getImageProps({ ...common, src: slide.desktop });
        const { props: mobile } = getImageProps({ ...common, src: slide.mobile });
        // The first slide uses one file for both breakpoints, so a single <head> preload covers it.
        if (index === 0) preload(mobile.src, { as: "image", fetchPriority: "high", imageSrcSet: mobile.srcSet, imageSizes: "100vw" });
        return (
          <div key={slide.desktop} aria-hidden="true" style={index === 0 ? { backgroundImage: `url(${firstSlidePreview})` } : undefined} className={`${index === 0 ? "bg-cover bg-center lg:bg-right" : ""} absolute inset-0 -z-30 transition-opacity duration-1000 motion-reduce:transition-none ${active === index ? "opacity-100" : "opacity-0"}`}>
            <picture>
              <source media="(min-width: 40rem)" srcSet={desktop.srcSet} sizes="100vw" />
              <img {...mobile} alt="" ref={(element) => { images.current[index] = element; }} onLoad={() => noteLoaded(index)} className={slide.airport ? "-scale-x-100 object-cover object-[80%_center] sm:scale-x-100 sm:object-center lg:object-right" : "object-cover object-[70%_center] sm:object-center lg:object-right"} />
            </picture>
            {slide.airport && <HeroAirplanes />}
          </div>
        );
      })}
    </>
  );
}
