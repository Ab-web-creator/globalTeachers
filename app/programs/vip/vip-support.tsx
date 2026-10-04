import type { ReactNode } from "react";
import CheckList from "../components/check-list";
import FlowCard from "../components/flow-card";
import IconTiles from "../components/icon-tiles";
import ProgramSection from "../components/program-section";
import Prose from "../components/prose";
import { afterOffer, audience, important, offer, value } from "./content";

export default function VipSupport({ children }: { children?: ReactNode }) {
  return (
    <>
      <ProgramSection id="vip-offer" label="Оффер" title="А если пришёл оффер?" fade="rose" aside={<IconTiles title={offer.itemsTitle} items={offer.items} />}>
        <Prose paragraphs={offer.paragraphs} closing={offer.closing} />
      </ProgramSection>
      <ProgramSection id="vip-after-offer" label="После оффера" title="Предложение принято. Что дальше?" aside={<FlowCard title="Что впереди:" flow={afterOffer.flow} />}>
        <Prose paragraphs={afterOffer.paragraphs} closing={afterOffer.closing} />
      </ProgramSection>
      <ProgramSection id="vip-value" label="Ценность VIP" title="Что вы на самом деле покупаете в VIP?" fade="violet" aside={<CheckList items={value.moments} />}>
        <ul className="mt-6 flex flex-wrap gap-2">
          {value.notThis.map((text) => <li key={text} className="rounded-full bg-neutral-100 px-4 py-2 text-neutral-500">{text}</li>)}
        </ul>
        <p className="mt-6 text-2xl font-medium leading-snug text-brand-600">{value.statement}</p>
      </ProgramSection>
      <ProgramSection id="vip-audience" label="Для кого" title="Кому подходит VIP?" aside={<CheckList title={audience.itemsTitle} items={audience.items} />}>
        <Prose paragraphs={audience.paragraphs} />
      </ProgramSection>
      <ProgramSection id="vip-important" label="Честно о главном" title="Важно" footer={children}>
        <div className="max-w-2xl">
          <Prose paragraphs={important.paragraphs} closing={important.closing} />
          <p className="mt-6 border-l-2 border-brand-300 pl-4 text-lg font-medium leading-relaxed text-brand-700">{important.note}</p>
        </div>
      </ProgramSection>
    </>
  );
}
