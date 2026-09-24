import type { PanelProps } from "../content";
import AboutCopy from "./about-copy";
import AboutVisual from "./about-visual";

export default function AboutSection({ openPanel }: PanelProps) {
  return (
    <section id="about" aria-labelledby="about-title" className="mx-auto grid w-full max-w-400 items-center gap-8 px-6 py-8 sm:px-10 sm:py-12 lg:grid-cols-2 lg:gap-16 lg:px-16 xl:gap-20 xl:px-20">
      <AboutVisual />
      <AboutCopy openPanel={openPanel} />
    </section>
  );
}
