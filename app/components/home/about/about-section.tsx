import AboutCopy from "./about-copy";
import AboutVisual from "./about-visual";

export default function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-title" className="scroll-mt-16 bg-linear-to-b from-brand-50/60 to-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto grid w-full max-w-400 items-center gap-8 sm:px-10 lg:grid-cols-2 lg:gap-16 lg:px-16 xl:gap-20 xl:px-20">
        <AboutCopy />
        <AboutVisual />
      </div>
    </section>
  );
}
