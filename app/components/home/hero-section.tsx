import HeroImage from "./hero-image";
import Hero from "./hero";
import HeroAirplanes from "./hero-airplanes";
import styles from "./hero-mobile.module.css";

export default function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className={`${styles.mobileBackground} relative isolate flex flex-col overflow-hidden pt-16 sm:block sm:min-h-0 sm:bg-brand-900 lg:pt-18`}>
      <div className="relative isolate aspect-[9/10] shrink-0 sm:aspect-auto sm:absolute sm:inset-0 sm:-z-20 sm:min-h-0">
        <HeroImage />
        <HeroAirplanes />
        <div aria-hidden="true" className={`${styles.imageFade} pointer-events-none absolute inset-x-0 bottom-0 h-20 sm:hidden`} />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 hidden bg-linear-to-r from-blue-950/90 via-violet-900/60 via-35% to-transparent to-75% sm:block" />
      <div className={`${styles.copySurface} relative isolate mx-auto w-full max-w-400 px-6 sm:px-10 lg:px-16 xl:px-20`}>
        <Hero />
      </div>
    </section>
  );
}
