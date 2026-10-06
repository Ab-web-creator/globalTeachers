import LineIcon from "../../services/components/line-icon";
import { icons } from "../components/icons";
import { approach } from "./content";

const badges = [
  { path: icons.document, tone: "bg-brand-300/20 text-brand-600" },
  { path: icons.letter, tone: "bg-sky-100 text-brand-500" },
  { path: icons.folder, tone: "bg-accent-100 text-accent-600" },
  { path: icons.link, tone: "bg-sky-100 text-sky-700", linkedIn: true },
  { path: "M8 3v16l4-4 4 6 3-2-4-6h6L8 3Z M3 4l2 1 M4 9H2 M9 2V0", tone: "bg-amber-100 text-amber-700" },
  { path: "M9 4a3 3 0 1 0 0 6a3 3 0 1 0 0-6 M3 20v-2a6 6 0 0 1 12 0v2 M16 4a3 3 0 0 1 0 6 M17 12a5 5 0 0 1 4 5v3", tone: "bg-brand-300/20 text-brand-500" },
];

export default function ProPreparationSteps() {
  const steps = approach.flow.replace(/\.$/, "").split("→").map((text) => text.trim());

  return (
    <ol className="mt-10 grid gap-3 sm:grid-cols-2">
      {steps.map((text, index) => (
        <li key={text} className="flex min-w-0 items-center gap-3 rounded-xl border border-brand-200 bg-white/80 p-2">
          <span aria-hidden="true" className={`flex size-12 shrink-0 items-center justify-center rounded-full ${badges[index].tone}`}>
            {badges[index].linkedIn ? (
              <span className="flex size-6 items-center justify-center rounded bg-sky-700 text-lg font-bold leading-none text-white">in</span>
            ) : (
              <LineIcon path={badges[index].path} className="size-6" />
            )}
          </span>
          <span className="text-base font-medium leading-snug text-brand-950">{text}</span>
        </li>
      ))}
    </ol>
  );
}
