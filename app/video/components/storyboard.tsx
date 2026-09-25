import Image from "next/image";
import { scenes, timestamp } from "../scenes";

export default function Storyboard() {
  return (
    <section aria-labelledby="storyboard-title" className="mt-12">
      <h2 id="storyboard-title" className="text-2xl font-semibold">Кадры и текст диктора</h2>
      <ol className="mt-6 space-y-6">
        {scenes.map((scene, index) => {
          const start = scenes.slice(0, index).reduce((sum, item) => sum + item.seconds, 0);
          return (
            <li key={scene.title} className="overflow-hidden rounded-3xl border border-brand-100 bg-white sm:grid sm:grid-cols-2">
              <div className="relative aspect-video self-start">
                <Image src={scene.image} alt={scene.alt} fill sizes="(max-width: 640px) 100vw, 512px" className="object-cover" />
              </div>
              <div className="p-5 sm:p-6">
                <p className="text-sm font-semibold text-brand-500">Кадр {index + 1} · {timestamp(start)}–{timestamp(start + scene.seconds)}</p>
                <h3 className="mt-2 text-xl font-semibold">{scene.title}</h3>
                <p className="mt-3 text-sm font-medium text-brand-600">На экране: {scene.caption}</p>
                <p className="mt-3 text-base leading-relaxed text-neutral-700">{scene.narration}</p>
                <a href={scene.image} download className="mt-4 inline-block text-sm font-medium text-brand-500 underline underline-offset-4">Скачать изображение</a>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
