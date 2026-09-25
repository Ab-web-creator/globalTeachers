import Image from "next/image";
import AboutHighlights from "./about-highlights";

const teacherImage = "/images/about-teacher.png";

export default function AboutVisual() {
  return (
      <div className="relative mx-auto aspect-6/7 w-full bg-brand-50 sm:w-11/12 sm:max-w-lg sm:rounded-3xl">
        <Image src={teacherImage} alt="Man in a blue blazer at a desk with a laptop, teaching books, and an inspirational mug" fill sizes="(max-width: 639px) 100vw, (max-width: 1024px) 512px, (max-width: 1280px) 40vw, 512px" className="object-cover sm:rounded-3xl" />
        <AboutHighlights />
      </div>
  );
}
