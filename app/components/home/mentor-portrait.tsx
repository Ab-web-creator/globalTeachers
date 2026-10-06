import Image from "next/image";

export default function MentorPortrait() {
  return (
    <div data-reveal className="relative mx-auto hidden w-full max-w-md px-6 py-8 lg:block">
      <div aria-hidden="true" className="absolute inset-8 rotate-3 rounded-3xl bg-brand-300/20" />
      <figure className="relative -rotate-3 rounded-xl bg-white p-4 shadow-xl shadow-brand-950/10">
        <div className="relative aspect-4/5 overflow-hidden rounded-lg">
          <Image
            src="/images/interview-school.webp"
            alt="Глобус и стопка книг на столе"
            fill
            sizes="(min-width: 1024px) 368px, 100vw"
            className="object-cover object-center"
          />
        </div>
        <figcaption style={{ fontFamily: '"Segoe Print", "Bradley Hand", cursive' }} className="px-2 pt-6 pb-3 text-center text-2xl italic leading-relaxed text-brand-600">
          Я тоже начинал<br />с первого шага
        </figcaption>
      </figure>
    </div>
  );
}
