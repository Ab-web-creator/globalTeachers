import type { ReactNode } from "react";
import ProgramSection from "../components/program-section";
import Prose from "../components/prose";
import { important } from "./content";
import VipAudience from "./vip-audience";
import VipAfterOffer from "./vip-after-offer";
import VipOffer from "./vip-offer";
import VipValue from "./vip-value";

export default function VipSupport({ children }: { children?: ReactNode }) {
  return (
    <>
      <VipOffer />
      <VipAfterOffer />
      <VipValue />
      <VipAudience />
      <ProgramSection id="vip-important" label="Честно о главном" title="Важно" footer={children}>
        <div className="max-w-2xl">
          <Prose paragraphs={important.paragraphs} closing={important.closing} />
          <p className="mt-6 border-l-2 border-brand-300 pl-4 text-lg font-medium leading-relaxed text-brand-700">{important.note}</p>
        </div>
      </ProgramSection>
    </>
  );
}
