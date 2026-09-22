import Image from "next/image";
import AboutHighlights from "./about-highlights";

const teacherImage = "/images/about-teacher.png";

export default function AboutVisual() {
  return (
      <div className="relative mx-auto aspect-6/7 w-11/12 max-w-lg rounded-3xl bg-brand-50">
        <Image src={teacherImage} alt="Man in a blue blazer at a desk with a laptop, teaching books, and an inspirational mug" fill sizes="(max-width: 640px) 84vw, (max-width: 1024px) 512px, (max-width: 1280px) 40vw, 512px" className="rounded-3xl object-cover" />
        <AboutHighlights />
      </div>
  );
}
