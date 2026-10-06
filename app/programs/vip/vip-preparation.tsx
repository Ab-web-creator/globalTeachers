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
      <ProgramSection id="vip-difference" label="Отличие VIP" title={<>Не консультация. Не просто подготовка.<br /><span className="text-brand-500">Сопровождение.</span></>} asideAlign="end" aside={<Image src="/images/vip-guided-journey-tall-palms.webp" alt="" width={1536} height={1024} sizes="(min-width: 1280px) 448px, 384px" className="ml-auto hidden h-auto w-full max-w-md object-contain mask-r-from-98% mask-b-from-98% mask-l-from-98% lg:block" />}>
        <Prose paragraphs={difference.paragraphs} closing={difference.closing} />
      </ProgramSection>
      <VipStrategy />
      <VipPreparationOverview />
      <VipSearch />
    </>
  );
}
