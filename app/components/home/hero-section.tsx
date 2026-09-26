import HeroImage from "./hero-image";
import Hero from "./hero";
import HeroAirplanes from "./hero-airplanes";

export default function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate flex min-h-svh flex-col overflow-hidden bg-linear-to-r from-blue-600 to-violet-600 pt-16 sm:block sm:min-h-0 sm:bg-brand-900 sm:bg-none lg:pt-18">
      <div className="relative isolate min-h-68 flex-1 sm:absolute sm:inset-0 sm:-z-20 sm:min-h-0">
        <HeroImage />
        <HeroAirplanes />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 hidden bg-linear-to-r from-blue-950/90 via-violet-900/60 via-35% to-transparent to-75% sm:block" />
      <div className="mx-auto w-full max-w-400 px-6 sm:px-10 lg:px-16 xl:px-20">
        <Hero />
      </div>
    </section>
  );
}
