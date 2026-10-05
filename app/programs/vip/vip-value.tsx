import LineIcon from "../../services/components/line-icon";
import ProgramSection from "../components/program-section";
import { value } from "./content";

export default function VipValue() {
  return (
    <ProgramSection id="vip-value" label="Ценность VIP" title="Что вы на самом деле покупаете в VIP?" fade="violet">
      <div className="mt-4 max-w-lg text-lg leading-relaxed">
        <ul className="list-disc space-y-2 pl-5 text-neutral-600">
          {value.notThis.map((text) => <li key={text}>{text}</li>)}
        </ul>
        <p className="mt-6 font-semibold text-brand-600">{value.statement}</p>
      </div>
      <ul className="mt-8 grid gap-x-12 gap-y-6 sm:grid-cols-2">
        {value.moments.map((text) => (
          <li key={text} className="flex items-start gap-4">
            <span aria-hidden="true" className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-100/60 text-brand-600">
              <LineIcon path="M5 12l4 4 10-10" className="size-4" />
            </span>
            <p className="max-w-lg text-lg leading-relaxed text-neutral-600">{text}</p>
          </li>
        ))}
      </ul>
    </ProgramSection>
  );
}
