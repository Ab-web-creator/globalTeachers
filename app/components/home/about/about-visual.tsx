import Image from "next/image";
import AboutHighlights from "./about-highlights";

const teacherImage = "/images/about-teacher.png";

export default function AboutVisual() {
  return (
      <div data-reveal className="relative mx-auto aspect-6/7 w-full sm:w-11/12 sm:max-w-lg sm:max-lg:aspect-auto sm:max-lg:w-full sm:max-lg:max-w-none">
        <div className="absolute inset-0 bg-brand-50 sm:rounded-3xl sm:max-lg:relative sm:max-lg:aspect-6/7 sm:max-lg:w-3/4 sm:max-lg:max-w-lg">
          <Image src={teacherImage} alt="Man in a blue blazer at a desk with a laptop, teaching books, and an inspirational mug" fill sizes="(max-width: 639px) 100vw, (max-width: 1024px) 512px, (max-width: 1280px) 40vw, 512px" className="object-cover sm:rounded-3xl" />
        </div>
        <AboutHighlights />
      </div>
  );
}
