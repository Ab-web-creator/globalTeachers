import HeroImage from "./hero-image";
import Hero from "./hero";
import HeroAirplanes from "./hero-airplanes";

export default function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-orange-50 pt-16 sm:bg-brand-900 lg:pt-18">
      <div className="relative isolate h-68 sm:absolute sm:inset-0 sm:-z-20 sm:h-auto">
        <HeroImage />
        <HeroAirplanes />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden w-1/2 bg-linear-to-bl from-sky-200/95 via-violet-200/95 to-orange-200/90 mask-linear-270 mask-linear-from-40% mask-linear-to-100% sm:block" />
      <div className="mx-auto w-full max-w-400 px-6 sm:px-10 lg:px-16 xl:px-20">
        <Hero />
      </div>
    </section>
  );
}
