import Image from "next/image";
import Hero from "./hero";
import HeroAirplanes from "./hero-airplanes";

export default function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-brand-900 pt-16 lg:pt-18">
      <Image src="/images/hero-airport-family-sunrise-v2.png" alt="" fill preload sizes="100vw" className="-z-30 -scale-x-100 object-cover object-[80%_center] sm:object-right" />
      <HeroAirplanes />
      <div aria-hidden="true" className="absolute inset-0 -z-10 hidden bg-linear-to-l from-blue-950/90 via-violet-900/60 via-35% to-transparent to-75% sm:block" />
      <div className="mx-auto w-full max-w-400 px-6 sm:px-10 lg:px-16 xl:px-20">
        <Hero />
      </div>
    </section>
  );
}
