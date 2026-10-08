import Image from "next/image";
import SectionHeading from "../../services/components/section-heading";
import SectionLabel from "../../services/components/job-search/section-label";
import VaseDocumentAnimation from "./vase-document-animation";
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
            {index === approach.paragraphs.length - 1 && <><br /><strong className="font-semibold text-brand-950">{approach.flowTitle}</strong></>}
          </p>
        ))}
        <ProPreparationSteps />
      </div>
      <div style={{ aspectRatio: "2 / 3" }} className="relative mt-12 hidden w-full max-w-sm justify-self-center lg:col-span-2 lg:block">
        <Image src="/images/pro-document-vase-bouquet-v2.png" alt="Ваза с декором в виде CV, портфолио и сопроводительного письма, с букетом живых цветов" fill sizes="(min-width: 1024px) 384px, 0px" className="object-contain" />
        <VaseDocumentAnimation />
      </div>
    </section>
  );
}
