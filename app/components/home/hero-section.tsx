import type { PanelProps } from "./content";
import Hero from "./hero";
import LearningGallery from "./learning-gallery";

export default function HeroSection({ openPanel }: PanelProps) {
  return (
    <div className="mx-auto grid w-full max-w-400 items-center gap-12 px-6 py-12 sm:px-10 sm:py-16 lg:min-h-[calc(100svh-101px)] lg:grid-cols-[1fr_1.08fr] lg:gap-14 lg:px-16 xl:gap-20 xl:px-20">
      <Hero openPanel={openPanel} />
      <LearningGallery openPanel={openPanel} />
    </div>
  );
}
