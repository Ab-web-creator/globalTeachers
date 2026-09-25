export default function FinishedVideo() {
  return (
    <section aria-labelledby="finished-video-title" className="mt-8">
      <h2 id="finished-video-title" className="mb-4 text-2xl font-semibold">Готовый ролик с озвучкой</h2>
      <video
        controls
        playsInline
        preload="metadata"
        aria-label="Видеопрезентация GlobalTeacherHub на русском языке"
        className="aspect-video w-full rounded-3xl bg-brand-900"
      >
        <source src="/video/globalteacherhub-ru.mp4" type="video/mp4" />
        <track default kind="captions" src="/video/globalteacherhub-ru.vtt" srcLang="ru" label="Русский" />
      </video>
      <a href="/video/globalteacherhub-ru.mp4" download className="mt-4 inline-flex rounded-full bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600">
        Скачать видео MP4
      </a>
      <p className="mt-3 text-sm text-neutral-600">Единый видеофайл с демонстрационной синтетической озвучкой. 1280 × 720 · русский язык.</p>
    </section>
  );
}
