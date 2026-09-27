import Image from "next/image";
import AboutGuidanceCard from "./about-guidance-card";

export default function AboutVisual() {
  return (
    <div className="mx-auto grid w-full max-w-2xl grid-cols-2 gap-3 px-6 sm:gap-5 sm:px-0 sm:max-lg:max-w-none">
        <div data-reveal className="relative aspect-5/6 overflow-hidden rounded-2xl bg-brand-50 sm:rounded-3xl">
          <Image src="/images/educators-colorful-wide.png" alt="Педагоги работают вместе в библиотеке" fill sizes="(max-width: 639px) 45vw, (max-width: 1023px) calc((100vw - 100px) / 2), 22vw" className="object-cover object-center" />
        </div>
      <div data-reveal className="relative aspect-5/6 min-w-0 overflow-hidden min-[550px]:col-start-2 min-[550px]:row-span-2 min-[550px]:row-start-1 min-[550px]:aspect-auto rounded-2xl bg-brand-50 sm:rounded-3xl">
        <Image src="/images/myOwnImage-education-wide.png" alt="Основатель GlobalTeacherHub в библиотеке" fill sizes="(max-width: 639px) 45vw, (max-width: 1023px) calc((100vw - 100px) / 2), 22vw" className="origin-[50%_20%] scale-150 object-cover object-top min-[550px]:origin-center min-[550px]:scale-100 min-[550px]:object-center" />
      </div>
      <div className="col-span-2 flex min-[550px]:col-span-1 min-[550px]:col-start-1 min-[550px]:row-start-2">
        <AboutGuidanceCard />
      </div>
    </div>
  );
}
