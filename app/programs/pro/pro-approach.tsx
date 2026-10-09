import { applicationPointerIconPath, interviewPeopleIconPath, programIconPaths, StrokeIcon } from "@/app/components/svg";
import Image from "next/image";
import SectionLabel from "../../services/components/job-search/section-label";
import SectionHeading from "../../services/components/section-heading";
import { approach } from "./content";
import VaseDocumentAnimation from "./vase-document-animation";

const badges = [
  { path: programIconPaths.document, tone: "bg-brand-300/20 text-brand-600" },
  { path: programIconPaths.letter, tone: "bg-sky-100 text-brand-500" },
  { path: programIconPaths.folder, tone: "bg-accent-100 text-accent-600" },
  { path: programIconPaths.link, tone: "bg-sky-100 text-sky-700", linkedIn: true },
  { path: applicationPointerIconPath, tone: "bg-amber-100 text-amber-700" },
  { path: interviewPeopleIconPath, tone: "bg-brand-300/20 text-brand-500" },
];

export default function ProApproach() {
  return (
    <section aria-labelledby="pro-approach" className="relative isolate grid items-center gap-10 lg:grid-cols-5 lg:gap-12 py-12 sm:py-16 lg:py-20">
      <div className="min-w-0 lg:col-span-3">
        <SectionLabel>Подход</SectionLabel>
        <SectionHeading id="pro-approach">Не просто рекомендации —<br />мы готовим вместе с вами</SectionHeading>
        {approach.paragraphs.map((text, index) => (<p key={text} className={`${index === 0 ? "mt-7" : "mt-4"} text-lg leading-relaxed text-neutral-600`}>
          {text}
          {index === approach.paragraphs.length - 1 && <><br /><strong className="font-semibold text-brand-950">{approach.flowTitle}</strong></>}
        </p>))}
        <ProPreparationSteps />
      </div>
      <div style={{ aspectRatio: "2 / 3" }} className="relative mt-12 hidden w-full max-w-sm justify-self-center lg:col-span-2 lg:block">
        <Image src="/images/pro-document-vase-bouquet-v2.png" alt="Ваза с декором в виде CV, портфолио и сопроводительного письма, с букетом живых цветов" fill sizes="(min-width: 1024px) 384px, 0px" className="object-contain" />
        <VaseDocumentAnimation />
      </div>
    </section>
  );
}

function ProPreparationSteps() {
  const steps = approach.flow.replace(/\.$/, "").split("→").map(text => text.trim());
  return (
    <ol className="mt-10 grid gap-3 sm:grid-cols-2">
      {steps.map((text, index) => (<li key={text} className="flex min-w-0 items-center gap-3 rounded-xl border border-brand-200 bg-white/80 p-2">
        <span aria-hidden="true" className={`flex size-12 shrink-0 items-center justify-center rounded-full ${badges[index].tone}`}>
          {badges[index].linkedIn ? (<span className="flex size-6 items-center justify-center rounded bg-sky-700 text-lg font-bold leading-none text-white">in</span>) : (<StrokeIcon path={badges[index].path} className="size-6" />)}
        </span>
        <span className="text-lg font-normal leading-snug text-brand-950">{text}</span>
      </li>))}
    </ol>
  );
}
