import LineIcon from "../../services/components/line-icon";
import ProgramSection from "../components/program-section";
import { icons } from "../components/icons";
import { searchIntroduction, searchStages } from "./content";

const stageIcons = [
  icons.search,
  icons.document,
  "M9 4a3 3 0 1 0 0 6a3 3 0 1 0 0-6 M3 20v-2a6 6 0 0 1 12 0v2 M16 4a3 3 0 0 1 0 6 M17 12a5 5 0 0 1 4 5v3",
];
const takeawayIcons = [icons.target, icons.chat, "M4 20V14 M10 20V9 M16 20V4"];

function SearchNote() {
  return (
    <span style={{ fontFamily: '"Segoe Print", "Bradley Hand", cursive' }} className="block max-w-64 -rotate-3 text-right text-xl font-normal italic leading-relaxed tracking-normal text-brand-400">
      От заявки до предложения<br />— мы рядом
    </span>
  );
}

export default function VipSearch() {
  return (
    <ProgramSection
      id="vip-search"
      label="Поиск вместе"
      title={<span className="block lg:pr-80">Когда поиск <span className="text-brand-500">уже начался</span></span>}
      decoration={<div className="mt-9 mr-10"><SearchNote /></div>}
    >
      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-neutral-600 lg:max-w-none lg:pr-80 xl:max-w-3xl xl:pr-0">{searchIntroduction}</p>
      <div aria-hidden="true" className="mt-6 flex justify-end pr-10 lg:hidden"><SearchNote /></div>
      <ol className="mt-10 grid gap-8 lg:grid-cols-3 lg:gap-20">
        {searchStages.map(({ id, title, paragraphs, closing }, index) => (
          <li key={id} className="flex min-w-0 flex-col">
            <div className="relative mb-6">
              <span aria-hidden="true" className="flex size-20 items-center justify-center rounded-full bg-brand-300/10 ring-8 ring-brand-300/5">
                <LineIcon path={stageIcons[index]} className="size-10 text-brand-600" />
              </span>
              {index < searchStages.length - 1 && (
                <svg aria-hidden="true" viewBox="0 0 200 16" preserveAspectRatio="none" className="absolute right-0 bottom-8 hidden h-4 w-3/5 translate-x-6 text-brand-300/60 lg:block" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M0 8H196 M189 1l7 7-7 7" />
                </svg>
              )}
            </div>
            <h3 id={id} className="text-xl font-semibold leading-snug tracking-tight text-brand-950">{title}</h3>
            <div className="mt-5 flex-1 space-y-4 text-base leading-relaxed text-neutral-600">
              {paragraphs.map((text) => <p key={text}>{text}</p>)}
            </div>
            <div className="mt-6 flex items-start gap-4 rounded-2xl border border-brand-300/10 bg-brand-300/10 p-5 text-brand-600">
              <LineIcon path={takeawayIcons[index]} className="mt-1 size-6 shrink-0" />
              <p className="text-sm leading-relaxed">{closing}</p>
            </div>
          </li>
        ))}
      </ol>
    </ProgramSection>
  );
}
