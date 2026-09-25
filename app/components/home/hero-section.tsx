import Image from "next/image";
import type { PanelProps } from "./content";
import Hero from "./hero";
import HeroAirplanes from "./hero-airplanes";

export default function HeroSection({ openPanel }: PanelProps) {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-brand-900 pt-16 lg:pt-18">
      <Image src="/images/hero-airport-family-v2.png" alt="" fill preload sizes="100vw" className="-z-30 object-cover object-center lg:object-right" />
      <HeroAirplanes />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-blue-950/90 via-violet-900/60 via-35% to-transparent to-75%" />
      <div className="mx-auto w-full max-w-400 px-6 sm:px-10 lg:px-16 xl:px-20">
        <Hero openPanel={openPanel} />
      </div>
    </section>
  );
}
