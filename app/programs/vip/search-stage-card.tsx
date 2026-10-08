import LineIcon from "../../services/components/line-icon";
import { icons } from "../components/icons";

const tones = [
  "bg-violet-50 text-brand-500",
  "bg-sky-50 text-sky-600",
  "bg-amber-50 text-amber-600",
];
const stageIcons = [icons.search, icons.document, icons.chat];

type Props = { id: string; title: string; paragraphs: string[]; closing: string; index: number };

export default function SearchStageCard({ id, title, paragraphs, closing, index }: Props) {
  return (
    <li className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8 lg:grid lg:grid-cols-3 lg:gap-10">
      <div>
        <div className="mb-5 flex items-center gap-4">
          <span aria-hidden="true" className={`flex size-14 items-center justify-center rounded-2xl ${tones[index]}`}>
            <LineIcon path={stageIcons[index]} className="size-7" />
          </span>
          <span className="text-sm font-medium tracking-widest text-neutral-400">0{index + 1}</span>
        </div>
        <h3 id={id} className="max-w-xs text-xl font-semibold leading-snug tracking-tight text-brand-950">{title}</h3>
      </div>
      <div className="mt-5 lg:col-span-2 lg:mt-0">
        <div className="space-y-4 text-base leading-relaxed text-neutral-600">
          {paragraphs.map((text) => <p key={text}>{text}</p>)}
        </div>
        <p className="mt-6 border-l-2 border-brand-300 pl-4 text-base font-medium leading-relaxed text-brand-600">{closing}</p>
      </div>
    </li>
  );
}
