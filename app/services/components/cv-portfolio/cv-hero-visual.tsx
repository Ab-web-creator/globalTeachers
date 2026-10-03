import Image from "next/image";

export default function CvHeroVisual() {
  return (
    <div aria-hidden="true" className="relative mx-auto aspect-square w-full max-w-xl">
      <div className="absolute top-0 left-4 size-1/2 rounded-full bg-brand-100" />
      <div className="absolute right-0 bottom-8 size-1/4 rounded-full bg-brand-300/30" />
      <div className="absolute inset-8 overflow-hidden rounded-full shadow-xl shadow-brand-500/10">
        <Image src="/images/benefits/development.jpg" alt="" fill preload sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />
      </div>
    </div>
  );
}
