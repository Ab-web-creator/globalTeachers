import Image from "next/image";
import { photos, type PanelProps } from "./content";
import EducatorCard from "./educator-card";

export default function LearningGallery({ openPanel }: PanelProps) {
  return (
    <section aria-label="Learn together with Global Teacher Hub" className="grid auto-rows-min grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:gap-7">
      <div className="relative aspect-5/6 overflow-hidden rounded-3xl">
        <Image src={photos.portrait} alt="Portrait of a man in a tuxedo holding a conductor’s baton" fill preload sizes="(max-width: 639px) 100vw, (max-width: 1024px) 45vw, 25vw" className="object-cover object-top" />
      </div>
      <div className="relative row-span-2 hidden overflow-hidden rounded-3xl bg-[#e7eae7] sm:block">
        <Image src="/images/educators-colorful.png" alt="Three educators in colorful clothing collaborating around a laptop in a library" fill preload sizes="(max-width: 1024px) 45vw, 25vw" className="object-cover object-center" />
        <button onClick={() => openPanel("Demo")} aria-label="Open the Global Teacher Hub demo preview" className="absolute top-1/2 left-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl sm:rounded-full bg-brand-100 transition hover:scale-105 hover:bg-white sm:size-22">
          <svg viewBox="0 0 24 28" className="ml-1 h-7 w-6" fill="currentColor" aria-hidden="true"><path d="M3 1 23 14 3 27V1Z" /></svg>
        </button>
      </div>
      <EducatorCard openPanel={openPanel} />
    </section>
  );
}
