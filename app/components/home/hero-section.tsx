import HeroImage from "./hero-image";
import Hero from "./hero";
import HeroAirplanes from "./hero-airplanes";

export default function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate flex min-h-svh flex-col overflow-hidden bg-linear-to-r from-blue-600 to-violet-600 pt-16 sm:block sm:min-h-0 sm:bg-brand-900 sm:bg-none lg:pt-18">
      <div className="relative isolate min-h-68 flex-1 sm:absolute sm:inset-x-0 sm:top-16 sm:bottom-0 sm:-z-20 sm:min-h-0 lg:top-18">
        <HeroImage />
        <HeroAirplanes />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute top-16 right-0 bottom-0 -z-10 hidden w-1/2 bg-linear-to-bl from-sky-200/95 via-violet-200/95 to-orange-200/90 mask-linear-270 mask-linear-from-40% mask-linear-to-100% sm:block lg:top-18" />
      <div className="mx-auto w-full max-w-400 px-6 sm:px-10 lg:px-16 xl:px-20">
        <Hero />
      </div>
    </section>
  );
}
