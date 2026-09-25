import type { PanelProps } from "../content";
import AboutCopy from "./about-copy";
import AboutVisual from "./about-visual";

export default function AboutSection({ openPanel }: PanelProps) {
  return (
    <section id="about" aria-labelledby="about-title" className="bg-linear-to-b from-brand-50/60 to-white">
      <div className="mx-auto grid w-full max-w-400 items-center gap-8 py-8 sm:px-10 sm:py-12 lg:grid-cols-2 lg:gap-16 lg:px-16 xl:gap-20 xl:px-20">
        <AboutVisual />
        <AboutCopy openPanel={openPanel} />
      </div>
    </section>
  );
}
