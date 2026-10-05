import Image from "next/image";
import SectionHeading from "../../services/components/section-heading";
import SectionFade from "../../services/components/cv-portfolio/section-fade";
import SectionLabel from "../../services/components/job-search/section-label";
import ProPreparationSteps from "./pro-preparation-steps";
import { approach } from "./content";

export default function ProApproach() {
  return (
    <section aria-labelledby="pro-approach" className="relative isolate grid items-center gap-10 lg:grid-cols-5 lg:gap-12 py-12 sm:py-16 lg:py-20">
      <SectionFade tone="violet" />
      <div className="min-w-0 lg:col-span-3">
        <SectionLabel>Подход</SectionLabel>
        <SectionHeading id="pro-approach">Не просто рекомендации —<br />мы готовим вместе с вами</SectionHeading>
        {approach.paragraphs.map((text, index) => <p key={text} className={`${index === 0 ? "mt-7" : "mt-4"} max-w-2xl text-lg leading-relaxed text-neutral-600`}>{text}</p>)}
        <p className="mt-6 text-lg font-medium leading-relaxed text-brand-950">{approach.flowTitle}</p>
        <ProPreparationSteps />
      </div>
      <div style={{ aspectRatio: "25 / 23" }} className="relative hidden w-full max-w-md justify-self-center lg:col-span-2 lg:block">
        <Image src="/images/consultation-globe-books.png" alt="Глобус, книги и паспорт на рабочем столе" fill sizes="448px" className="object-cover object-left mask-l-from-80% mask-b-from-85%" />
      </div>
    </section>
  );
}
