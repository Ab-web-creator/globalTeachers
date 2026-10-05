import LineIcon from "../../services/components/line-icon";
import ProgramSection from "../components/program-section";
import { audience } from "./content";

export default function VipAudience() {
  return (
    <ProgramSection id="vip-audience" label="Для кого" title="Кому подходит VIP?">
      <div className="mt-4 max-w-lg">
        {audience.paragraphs.map((text) => (
          <p key={text} className="text-lg leading-relaxed text-neutral-600">{text}</p>
        ))}
        <h3 className="mt-4 text-lg font-semibold leading-relaxed text-brand-950">{audience.itemsTitle}</h3>
      </div>
      <ul className="mt-6 grid gap-x-12 gap-y-6 sm:grid-cols-2">
        {audience.items.map((text) => (
          <li key={text} className="flex items-start gap-4">
            <span aria-hidden="true" className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-100/60 text-brand-600">
              <LineIcon path="M5 12l4 4 10-10" className="size-4" />
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
