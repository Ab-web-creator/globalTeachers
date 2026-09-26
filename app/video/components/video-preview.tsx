"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { scenes } from "../scenes";
import timings from "../audio-timing.json";

const starts = timings.map((_, index) => timings.slice(0, index).reduce((sum, duration) => sum + duration, 0));

export default function VideoPreview() {
  const [index, setIndex] = useState(0);
  const audio = useRef<HTMLAudioElement>(null);
  const scene = scenes[index];

  function seek(next: number) {
    if (audio.current) audio.current.currentTime = starts[next];
    setIndex(next);
  }

  return (
    <section aria-labelledby="preview-title" className="mt-8">
      <h2 id="preview-title" className="mb-4 text-2xl font-semibold">Предпросмотр последовательности</h2>
      <div className="relative aspect-video overflow-hidden rounded-3xl bg-brand-900">
        <Image key={scene.image} src={scene.image} alt={scene.alt} fill sizes="(max-width: 1024px) 100vw, 1024px" className="object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-brand-950/90 via-transparent to-transparent" />
        <p className="absolute right-4 bottom-4 left-4 text-lg leading-tight font-semibold text-white sm:right-8 sm:bottom-8 sm:left-8 sm:text-3xl">{scene.caption}</p>
        <span className="absolute top-4 left-4 rounded-full bg-brand-950/80 px-3 py-1 text-sm text-white">{index + 1} / {scenes.length}</span>
      </div>
      <audio
        ref={audio}
        controls
        preload="metadata"
        aria-label="Русская озвучка GlobalTeacherHub"
        className="mt-4 w-full"
        onTimeUpdate={(event) => {
          const time = event.currentTarget.currentTime;
          let next = 0;
          starts.forEach((start, i) => { if (time >= start) next = i; });
          setIndex(next);
        }}
      >
        <source src="/audio/globalteacherhub-ru.mp3" type="audio/mpeg" />
      </audio>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" disabled={index === 0} onClick={() => seek(index - 1)} className="rounded-2xl sm:rounded-full bg-brand-100 px-4 py-2.5 sm:py-3 text-brand-600 disabled:opacity-40">Назад</button>
        <button type="button" disabled={index === scenes.length - 1} onClick={() => seek(index + 1)} className="rounded-2xl sm:rounded-full bg-brand-100 px-4 py-2.5 sm:py-3 text-brand-600 disabled:opacity-40">Далее</button>
        <a href="/audio/globalteacherhub-ru.mp3" download className="text-brand-500 underline underline-offset-4">Скачать озвучку MP3</a>
      </div>
      <p className="mt-4 text-base leading-relaxed text-neutral-700">{scene.narration}</p>
      <p className="mt-2 text-sm text-neutral-500">Демонстрационная синтетическая озвучка: русский голос Milena. Слайды синхронизированы с аудио. Это не запись голоса основателя.</p>
    </section>
  );
}
