import IconList from "../components/icon-list";
import ProgramSection from "../components/program-section";
import { offer } from "./content";

export default function VipOffer() {
  return (
    <ProgramSection id="vip-offer" label="Оффер" title="А если пришёл оффер?" fade="rose">
      <div className="mt-4 max-w-3xl space-y-4">
        <p className="max-w-lg text-lg leading-relaxed text-neutral-600">
          {offer.paragraphs[0]}{" "}
          <strong className="font-semibold text-brand-600">{offer.paragraphs[1]}</strong>
        </p>
        <h3 className="text-lg font-semibold leading-relaxed text-brand-950">{offer.itemsTitle}</h3>
      </div>

      <IconList items={offer.items} />

      <p className="mt-10 max-w-3xl border-l-2 border-brand-300 pl-5 text-lg leading-relaxed text-neutral-600 sm:mt-12">
        {offer.closing}
      </p>
    </ProgramSection>
  );
}
