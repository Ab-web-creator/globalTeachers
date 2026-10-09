"use client";

import { SlideshowPlaybackIcon } from "@/app/components/svg";
import Link from "next/link";
import { useRef, useState } from "react";
import HeroImage, { type HeroImageHandle } from "./hero-image";
import styles from "./hero-mobile.module.css";
import HeroRotationControlStyles from "./hero-rotation-control.module.css";

export default function HeroSection() {
  const [paused, setPaused] = useState(false);
  const image = useRef<HeroImageHandle>(null);
  function toggleRotation() {
    if (paused)
      image.current?.next();
    setPaused(!paused);
  }
  return (
    <section aria-labelledby="hero-title" className={`${styles.mobileBackground} relative isolate flex flex-col overflow-hidden bg-brand-900 pt-16 sm:block sm:min-h-0 lg:pt-18 xl:flex xl:min-h-dvh xl:justify-center`}>
      <div className="relative isolate aspect-9/10 shrink-0 sm:aspect-auto sm:absolute sm:inset-0 sm:-z-20 sm:min-h-0">
        <HeroImage ref={image} paused={paused} />
        <div aria-hidden="true" className={`${styles.imageFade} pointer-events-none absolute inset-x-0 bottom-0 h-20 sm:hidden`} />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 hidden sm:block bg-linear-to-r from-blue-950/90 via-violet-900/60 via-35% to-transparent to-75%" />
      <div className="relative isolate mx-auto w-full max-w-400 px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="relative z-10 max-w-3xl pt-2 pb-10 text-left sm:py-16 lg:py-24 xl:py-28">
          <p className="mb-4 text-[10px] font-semibold tracking-widest text-brand-50 uppercase sm:text-sm">Международная карьера педагога</p>
          <h1 id="hero-title" className={`${styles.heading} text-4xl leading-none font-semibold tracking-wide text-white sm:text-5xl xl:text-6xl 2xl:text-7xl`}>
            <span className="hidden sm:inline">Ваш опыт.<br /></span>
            Новая страна.<br />
            <span className="text-brand-200">Новые возможности.</span>
          </h1>
          <p className={`${styles.description} mt-7 max-w-xl text-base font-normal leading-relaxed text-brand-50 sm:text-lg`}>
            Помогаем учителям из СНГ строить карьеру за рубежом<span className="sm:hidden">.</span>
            <span className="hidden sm:inline"> — от оценки опыта и подготовки CV до собеседований и международного оффера.</span>
          </p>
          <div className="mt-8 hidden flex-wrap items-center justify-start gap-3 sm:flex sm:gap-4">
            <Link href="/consultation" className="inline-flex items-center justify-center gap-4 rounded-2xl sm:rounded-full bg-linear-to-r from-amber-200 to-orange-300 px-6 py-2.5 sm:py-4 text-base font-semibold text-stone-900 transition hover:from-amber-300 hover:to-orange-400 hover:shadow-md">
              Получить консультацию
            </Link>
            <a href="#programs" className="hidden rounded-2xl sm:rounded-full border border-brand-200/60 px-6 py-2.5 sm:py-4 text-base font-semibold text-white transition hover:bg-white/10 sm:inline-flex sm:font-medium">Выбрать программу</a>
          </div>
          <p className="mt-6 hidden text-base font-semibold leading-normal text-brand-200 sm:block sm:text-lg sm:font-normal">
            Понятный план <span aria-hidden="true" className="mx-2 inline-block align-middle text-2xl">•</span> Личная поддержка <span aria-hidden="true" className="mx-2 inline-block align-middle text-2xl">•</span> Ваш следующий шаг.
          </p>
        </div>
      </div>
      <HeroRotationControl paused={paused} onToggle={toggleRotation} />
    </section>
  );
}

function HeroRotationControl({ paused, onToggle }: {
  paused: boolean;
  onToggle: () => void;
}) {
  return (
    <button type="button" onClick={onToggle} aria-label={paused ? "Следующее изображение и продолжить смену" : "Приостановить смену изображений"} aria-pressed={paused} className={`${HeroRotationControlStyles.control} absolute right-6 bottom-6 z-20 flex size-10 items-center justify-center rounded-full border border-white/40 bg-brand-950/40 text-white backdrop-blur-sm transition-colors hover:bg-brand-950/70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:hidden`}>
      <SlideshowPlaybackIcon paused={paused} />
    </button>
  );
}
