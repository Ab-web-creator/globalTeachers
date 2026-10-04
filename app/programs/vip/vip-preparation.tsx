import Image from "next/image";
import GuideCard from "../../services/components/job-search/guide-card";
import CheckList from "../components/check-list";
import IconTiles from "../components/icon-tiles";
import ProgramSection from "../components/program-section";
import Prose from "../components/prose";
import { difference, preparation, searchStages, strategy } from "./content";
import TierCompare from "./tier-compare";

export default function VipPreparation() {
  return (
    <>
      <ProgramSection id="vip-difference" label="Отличие VIP" title={<>Не консультация. Не просто подготовка.<br />Сопровождение.</>} fade="violet" aside={<TierCompare />} asideAlign="end" decoration={<Image src="/images/mikelandjelo.png" alt="" width={1509} height={885} sizes="(min-width: 1280px) 544px, 480px" className="mt-12 block h-auto w-120 translate-x-12 xl:w-136" />}>
        <Prose paragraphs={difference.paragraphs} closing={difference.closing} />
      </ProgramSection>
      <ProgramSection id="vip-strategy" label="Стратегия" title="Сначала — стратегия" aside={<CheckList title="Определяем:" items={strategy.items} />}>
        <Prose paragraphs={strategy.paragraphs} closing={strategy.closing} />
      </ProgramSection>
      <ProgramSection id="vip-preparation" label="Подготовка" title="Полная профессиональная подготовка" fade="sky" aside={<IconTiles title="Мы готовим:" items={preparation.items} />}>
        <Prose paragraphs={preparation.paragraphs} closing={preparation.closing} />
      </ProgramSection>
      <ProgramSection id="vip-search" label="Поиск вместе" title="Когда поиск уже начался">
        <div className="mt-8 grid gap-12 lg:grid-cols-3">
          {searchStages.map(({ id, title, paragraphs, closing }) => (
            <GuideCard key={id} id={id} title={title}>
              {paragraphs.map((text) => <p key={text}>{text}</p>)}
              <p className="text-brand-600">{closing}</p>
            </GuideCard>
          ))}
        </div>
      </ProgramSection>
    </>
  );
}
