import Image from "next/image";
import ProgramSection from "../components/program-section";
import Prose from "../components/prose";
import { difference } from "./content";
import TierCompare from "./tier-compare";
import VipStrategy from "./vip-strategy";
import VipSearch from "./vip-search";
import VipPreparationOverview from "./vip-preparation-overview";

export default function VipPreparation() {
  return (
    <>
      <ProgramSection id="vip-difference" label="Отличие VIP" title={<>Не консультация. Не просто подготовка.<br /><span className="text-brand-500">Сопровождение.</span></>} fade="violet" aside={<TierCompare />} asideAlign="end" decoration={<Image src="/images/mikelandjelo.png" alt="" width={1509} height={885} sizes="(min-width: 1280px) 544px, 480px" className="mt-12 block h-auto w-120 translate-x-12 xl:w-136" />}>
        <Prose paragraphs={difference.paragraphs} closing={difference.closing} />
      </ProgramSection>
      <VipStrategy />
      <VipPreparationOverview />
      <VipSearch />
    </>
  );
}
