import { programIconPaths, StrokeIcon } from "@/app/components/svg";
import ProgramSection from "../components/program-section";
import { audience } from "./content";

const itemIcons = [programIconPaths.clock, programIconPaths.compass, programIconPaths.globe, programIconPaths.home, programIconPaths.health, programIconPaths.chat];

const itemColors = [
  { surface: "bg-sky-50 border-sky-200", icon: "bg-sky-500" },
  { surface: "bg-rose-50 border-rose-200", icon: "bg-rose-500" },
  { surface: "bg-amber-50 border-amber-200", icon: "bg-amber-500" },
  { surface: "bg-emerald-50 border-emerald-200", icon: "bg-emerald-500" },
  { surface: "bg-brand-50 border-brand-200", icon: "bg-brand-500" },
  { surface: "bg-fuchsia-50 border-fuchsia-200", icon: "bg-fuchsia-500" },
];

export default function VipAudience() {
  return (
    <ProgramSection id="vip-audience" label="Для кого" title="Кому подходит VIP?" fade="violet" fadeDirection="up" fadeToWhite>
      <div className="mt-7 max-w-lg">
        {audience.paragraphs.map((text) => (
          <p key={text} className="text-lg leading-relaxed text-neutral-600">{text}</p>
        ))}
        <h3 className="mt-4 text-lg font-semibold leading-relaxed text-brand-950">{audience.itemsTitle}</h3>
      </div>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {audience.items.map((text, index) => (
          <li key={text} className={`flex items-start gap-4 rounded-2xl border p-5 ${itemColors[index].surface}`}>
            <span aria-hidden="true" className={`mt-1 flex size-7 shrink-0 items-center justify-center rounded-full text-white ${itemColors[index].icon}`}>
              <StrokeIcon path={itemIcons[index]} className="size-4" />
            </span>
            <span className="max-w-lg text-lg leading-relaxed text-neutral-600 first-letter:uppercase">
              {text.replace(/[;.]$/, "")}
            </span>
          </li>
        ))}
      </ul>
    </ProgramSection>
  );
}
