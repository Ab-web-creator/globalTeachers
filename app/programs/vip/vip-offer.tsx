import IconList from "../components/icon-list";
import { iconTones } from "../components/icon-tones";
import ProgramSection from "../components/program-section";
import { offer } from "./content";

export default function VipOffer() {
  return (
    <ProgramSection id="vip-offer" label="Оффер" title={<span className="block max-w-[22ch]">А если предложение уже поступило?</span>} fade="violet" fadeDirection="down" fadeToWhite>
      <div className="mt-7 max-w-3xl space-y-4">
        <p className="max-w-lg text-lg leading-relaxed text-neutral-600">
          {offer.paragraphs[0]}
        </p>
        <p className="max-w-lg text-lg leading-relaxed text-neutral-600">
          <strong className="font-semibold text-brand-950">Мы смотрим на предложение целиком — разбираем все условия контракта вместе с вами.</strong>
        </p>
      </div>

      <div className="[&>ul>li:last-child]:bg-violet-50 [&>ul>li:last-child>span:last-child]:text-violet-900">
      <IconList
        items={offer.items.map((item, index) => ({
          ...item,
          tone: item.icon === "more" ? "bg-violet-100 text-violet-600" : iconTones[index % iconTones.length],
        }))}
        cards
        outlined
        bold
      />
      </div>

      <p className="mt-10 max-w-lg border-l-2 border-brand-300 pl-4 text-lg font-semibold leading-relaxed text-brand-600 sm:mt-12">
        {offer.closing}
      </p>
    </ProgramSection>
  );
}
