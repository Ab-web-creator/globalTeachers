import Image from "next/image";

const teacherImage = "/images/about-teacher.png";

export default function AboutVisual() {
  return (
      <div className="relative aspect-6/7 overflow-hidden rounded-3xl bg-brand-50">
        <Image src={teacherImage} alt="Man in a blue blazer at a desk with a laptop, teaching books, and an inspirational mug" fill sizes="(max-width: 1024px) 90vw, 45vw" className="object-cover" />
      </div>
  );
}
