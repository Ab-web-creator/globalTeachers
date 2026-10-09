"use client";

import { AboutDissolveMask } from "@/app/components/svg";
import Image from "next/image";
import { useId, useState } from "react";
import styles from "./about-carousel.module.css";

type Photo = { src: string; alt: string; };

export default function AboutCarousel({ active, photos, sizes }: { active: number; photos: readonly Photo[]; sizes: string; }) {
  const maskId = useId().replace(/:/g, "");
  const [slide, setSlide] = useState({ current: active, previous: null as number | null, transition: 0 });
  if (slide.current !== active) {
    setSlide({ current: active, previous: slide.current, transition: slide.transition + 1 });
  }

  const outgoing = slide.previous === null ? null : photos[slide.previous];

  return (
    <div className="absolute inset-0 overflow-hidden">
      {photos.map((photo, index) => (
        <div key={photo.src} aria-hidden={active !== index} className={`absolute inset-0 ${index === active ? "opacity-100" : "opacity-0"}`}>
          <Image src={photo.src} alt={active === index ? photo.alt : ""} fill sizes={sizes} className="object-cover object-center" />
        </div>
      ))}
      {outgoing && (
        <div key={active} aria-hidden="true" className="absolute inset-0 motion-reduce:hidden">
          <AboutDissolveMask id={maskId} seed={slide.transition} />
          <div className={`absolute inset-0 ${styles.outgoing}`} style={{ maskImage: `url(#${maskId})`, WebkitMaskImage: `url(#${maskId})` }}>
            <Image src={outgoing.src} alt="" fill sizes={sizes} className="object-cover object-center" />
          </div>
        </div>
      )}
    </div>
  );
}
