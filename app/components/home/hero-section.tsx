import type { PanelProps } from "./content";
import Hero from "./hero";
import LearningGallery from "./learning-gallery";

export default function HeroSection({ openPanel }: PanelProps) {
  return (
    <div className="mx-auto grid w-full max-w-400 items-center gap-8 px-6 pt-6 pb-8 sm:px-10 sm:pt-8 sm:pb-10 lg:grid-cols-[1fr_1.08fr] lg:gap-14 lg:px-16 xl:gap-20 xl:px-20">
      <Hero openPanel={openPanel} />
      <LearningGallery openPanel={openPanel} />
    </div>
  );
}
