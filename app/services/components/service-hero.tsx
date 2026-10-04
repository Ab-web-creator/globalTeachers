import Image from "next/image";
import type { ReactNode } from "react";
import BackLink from "./back-link";

export default function ServiceHero({ image, children }: { image: string; children: ReactNode }) {
  return (
    <header className="relative isolate mt-6 grid items-start gap-8 bg-white lg:mt-0 lg:grid-cols-2 lg:gap-16">
      <BackLink className="lg:absolute lg:top-10 lg:left-4" />
      <div className="lg:order-2 lg:py-6">{children}</div>
      <div aria-hidden="true" className="relative mx-auto aspect-square w-full max-w-xl overflow-hidden lg:order-1 lg:mt-6 lg:max-w-none">
        <Image src={image} alt="" fill preload sizes="(min-width: 1600px) 688px, (min-width: 1024px) 45vw, (min-width: 640px) 576px, 100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-linear-to-l from-white via-transparent to-transparent" />
      </div>
    </header>
  );
}
