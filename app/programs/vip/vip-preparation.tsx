import Image from "next/image";
import ProgramSection from "../components/program-section";
import Prose from "../components/prose";
import { difference } from "./content";
import VipStrategy from "./vip-strategy";
import VipSearch from "./vip-search";
import VipPreparationOverview from "./vip-preparation-overview";

export default function VipPreparation() {
  return (
    <>
      <ProgramSection id="vip-difference" label="Отличие VIP" title={<>Не консультация.<br />Не просто подготовка.<br /><span className="text-brand-500">Сопровождение.</span></>} aside={<Image src="/images/vip-career-guidance-professional.webp" alt="" width={1254} height={1254} sizes="(min-width: 1280px) 448px, 384px" className="ml-auto hidden h-auto w-full max-w-md object-contain lg:block" />}>
        <Prose paragraphs={difference.paragraphs} />
        <p className="mt-6 max-w-lg border-l-2 border-brand-300 pl-4 text-lg font-semibold leading-relaxed text-brand-600">
          {difference.closing}
        </p>
      </ProgramSection>
      <VipStrategy />
      <VipPreparationOverview />
      <VipSearch />
    </>
  );
}
