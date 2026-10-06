import Image from "next/image";
import SectionHeading from "../../services/components/section-heading";
import SectionLabel from "../../services/components/job-search/section-label";
import ProPreparationSteps from "./pro-preparation-steps";
import { approach } from "./content";

export default function ProApproach() {
  return (
    <section aria-labelledby="pro-approach" className="relative isolate grid items-center gap-10 lg:grid-cols-5 lg:gap-12 py-12 sm:py-16 lg:py-20">
      <div className="min-w-0 lg:col-span-3">
        <SectionLabel>Подход</SectionLabel>
        <SectionHeading id="pro-approach">Не просто рекомендации —<br />мы готовим вместе с вами</SectionHeading>
        {approach.paragraphs.map((text, index) => (
          <p key={text} className={`${index === 0 ? "mt-7" : "mt-4"} text-lg leading-relaxed text-neutral-600`}>
            {text}
            {index === approach.paragraphs.length - 1 && <> <strong className="font-semibold text-brand-950">{approach.flowTitle}</strong></>}
          </p>
        ))}
        <ProPreparationSteps />
      </div>
      <div style={{ aspectRatio: "25 / 23" }} className="relative mt-12 hidden w-full max-w-xs justify-self-center lg:col-span-2 lg:block">
        <Image src="/images/pro-application-kit-illustration.png" alt="Профессиональный комплект: CV, портфолио, сопроводительное письмо и профиль" fill sizes="320px" className="object-contain" />
      </div>
    </section>
  );
}
