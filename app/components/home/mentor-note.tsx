import Image from "next/image";
import type { PanelProps } from "./content";
import MentorMessage from "./mentor-message";

export default function MentorNote({ openPanel }: PanelProps) {
  return (
    <section aria-labelledby="mentor-note-title" className="bg-linear-to-br from-sky-100 via-blue-50 to-violet-100 px-6 py-10 sm:px-10 sm:py-12 lg:py-20 xl:py-24 lg:px-16">
      <div className="mx-auto grid max-w-400 items-center gap-8 lg:grid-cols-2 lg:gap-16 xl:gap-20">
        <div data-reveal className="relative mx-auto hidden aspect-6/7 w-full max-w-lg overflow-hidden rounded-3xl lg:block">
          <Image src="/images/about-teacher.png" alt="Основатель GlobalTeacherHub за рабочим столом" fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 512px, 40vw" className="object-cover" />
        </div>
        <div className="order-first lg:order-none">
          <MentorMessage openPanel={openPanel} />
        </div>
      </div>
    </section>
  );
}
