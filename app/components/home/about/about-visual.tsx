import Image from "next/image";
import AboutGuidanceCard from "./about-guidance-card";

export default function AboutVisual() {
  return (
    <div className="mx-auto grid w-full max-w-2xl grid-cols-2 gap-3 px-6 sm:gap-5 sm:px-0 sm:max-lg:max-w-none">
      <div className="flex min-w-0 flex-col gap-3 sm:gap-5">
        <div data-reveal className="relative aspect-5/6 overflow-hidden rounded-2xl bg-brand-50 sm:rounded-3xl">
          <Image src="/images/educators-colorful-wide.png" alt="Педагоги работают вместе в библиотеке" fill sizes="(max-width: 639px) 45vw, (max-width: 1023px) calc((100vw - 100px) / 2), 22vw" className="object-cover object-center" />
        </div>
        <AboutGuidanceCard />
      </div>
      <div data-reveal className="relative min-w-0 overflow-hidden rounded-2xl bg-brand-50 sm:rounded-3xl">
        <Image src="/images/myOwnImage-education-wide.png" alt="Основатель GlobalTeacherHub в библиотеке" fill sizes="(max-width: 639px) 45vw, (max-width: 1023px) calc((100vw - 100px) / 2), 22vw" className="object-cover object-center" />
      </div>
    </div>
  );
}
