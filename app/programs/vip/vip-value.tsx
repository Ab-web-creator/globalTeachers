import ProgramSection from "../components/program-section";
import { value } from "./content";
import VipSupportMoments from "./vip-support-moments";

export default function VipValue() {
  return (
    <div className="relative isolate">
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 bg-violet-50" />
      <ProgramSection id="vip-value" label="Ценность VIP" title="Что вы на самом деле покупаете в VIP?">
        <div className="mt-7 max-w-lg text-lg leading-relaxed">
          <ul className="list-disc space-y-2 pl-5 text-neutral-600">
            {value.notThis.map((text) => <li key={text}>{text}</li>)}
          </ul>
          <p className="mt-6 font-semibold text-brand-600">{value.statement}</p>
        </div>
        <VipSupportMoments />
      </ProgramSection>
    </div>
  );
}
