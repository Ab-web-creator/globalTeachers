import type { Metadata } from "next";
import Link from "next/link";
import VideoPreview from "./components/video-preview";
import FinishedVideo from "./components/finished-video";
import Storyboard from "./components/storyboard";
import { totalSeconds, voiceover } from "./scenes";

export const metadata: Metadata = {
  title: "Видеопрезентация — GlobalTeacherHub",
  description: "Сценарий рекламного ролика: изображения по порядку и текст озвучки на русском языке.",
};

export default function VideoPage() {
  return (
    <main lang="ru" className="min-h-screen bg-linear-to-b from-brand-50 to-white px-6 py-8 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-sm font-medium text-brand-500 hover:underline">← На главную</Link>
        <header className="mt-8">
          <p className="text-sm font-semibold tracking-widest text-brand-500 uppercase">GlobalTeacherHub · Видеопрезентация</p>
          <h1 className="mt-3 text-4xl leading-tight font-semibold tracking-wide sm:text-5xl">Ваша международная история</h1>
          <p className="mt-4 max-w-3xl text-lg leading-normal text-neutral-600">Личное обращение к педагогам: от сомнений к понятному следующему шагу. 8 кадров · около {Math.round(totalSeconds)} секунд · озвучка от первого лица.</p>
        </header>
        <FinishedVideo />
        <VideoPreview />
        <Storyboard />
        <section aria-labelledby="voiceover-title" className="mt-12 rounded-3xl bg-brand-50 p-6 sm:p-8">
          <h2 id="voiceover-title" className="text-2xl font-semibold">Полный текст для озвучки</h2>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-neutral-700">
            {voiceover.split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <p className="mt-6 border-t border-brand-200 pt-4 text-sm leading-normal text-brand-600">Голос: тёплый, спокойный, уверенный. Короткие паузы между мыслями. Монтаж: плавная смена кадров, лёгкое приближение фотографий, негромкая инструментальная музыка. Финальный кадр задержать на названии компании и приглашении на консультацию.</p>
        </section>
      </div>
    </main>
  );
}
