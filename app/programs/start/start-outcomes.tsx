import Image from "next/image";
import SectionHeading from "../../services/components/section-heading";
import SectionLabel from "../../services/components/job-search/section-label";
import NumberedSteps from "../components/numbered-steps";

export default function StartOutcomes({ flow }: { flow: string }) {
  return (
    <section aria-labelledby="start-outcomes" className="grid items-center gap-10 lg:grid-cols-5 lg:gap-12 py-12 sm:py-16 lg:py-20">
      <div className="min-w-0 lg:col-span-3">
        <SectionLabel>Результат программы</SectionLabel>
        <SectionHeading id="start-outcomes">Вы будете понимать:</SectionHeading>
        <p className="mt-7 max-w-2xl text-lg leading-relaxed text-neutral-600">После разбора вашего профиля и персональной консультации у вас появится понятный план самостоятельного поиска работы — от выбора подходящих школ до подготовки первых откликов.</p>
        <NumberedSteps flow={flow} />
      </div>
      <div style={{ aspectRatio: "25 / 23" }} className="relative hidden w-full max-w-md justify-self-center lg:col-span-2 lg:block">
        <Image src="/images/career-compass.png" alt="Компас на карте мира" fill sizes="448px" className="object-cover mask-l-from-80% mask-b-from-85%" />
      </div>
    </section>
  );
}
