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
      <ProgramSection id="vip-difference" label="Отличие VIP" title={<>Не консультация. Не просто подготовка.<br /><span className="text-brand-500">Сопровождение.</span></>} aside={<Image src="/images/vip-guided-journey-clean.png" alt="" width={1536} height={1024} sizes="(min-width: 1280px) 448px, 384px" className="mx-auto hidden h-auto w-full max-w-md object-contain mask-r-from-85% mask-b-from-85% mask-l-from-95% lg:block" />}>
        <Prose paragraphs={difference.paragraphs} closing={difference.closing} />
      </ProgramSection>
      <VipStrategy />
      <VipPreparationOverview />
      <VipSearch />
    </>
  );
}
