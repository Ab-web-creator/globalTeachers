import Image from "next/image";
import { photos, type PanelProps } from "./content";
import EducatorCard from "./educator-card";

export default function LearningGallery({ openPanel }: PanelProps) {
  return (
    <section aria-label="Learn together with Educine" className="grid grid-cols-2 grid-rows-[1.58fr_1fr] gap-4 sm:gap-6 lg:gap-7">
      <div className="relative aspect-5/6 overflow-hidden rounded-3xl">
        <Image src={photos.study} alt="Two students studying together with a laptop and notebook" fill unoptimized preload sizes="(max-width: 1024px) 45vw, 25vw" className="object-cover" />
      </div>
      <div className="relative row-span-2 overflow-hidden rounded-3xl bg-[#e7eae7]">
        <Image src={photos.student} alt="Student enjoying a book on campus" fill unoptimized preload sizes="(max-width: 1024px) 45vw, 25vw" className="object-cover object-center" />
        <button onClick={() => openPanel("Demo")} aria-label="Open the Educine demo preview" className="absolute top-1/2 left-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#d3ebf0] transition hover:scale-105 hover:bg-white sm:size-22">
          <svg viewBox="0 0 24 28" className="ml-1 h-7 w-6" fill="currentColor" aria-hidden="true"><path d="M3 1 23 14 3 27V1Z" /></svg>
        </button>
      </div>
      <EducatorCard />
    </section>
  );
}
