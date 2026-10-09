import { programIconPaths, StrokeIcon } from "@/app/components/svg";
import { iconTones } from "../components/icon-tones";
import ProgramSection from "../components/program-section";
import { value } from "./content";

export default function VipValue() {
  return (
    <div className="relative isolate">
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 bg-linear-to-r from-sky-50 to-violet-100" />
      <ProgramSection id="vip-value" label="Ценность VIP" title="Что вы на самом деле покупаете в VIP?">
        <div className="mt-7 max-w-lg text-lg leading-relaxed">
          <ul className="list-disc space-y-2 pl-5 text-neutral-600">
            {value.notThis.map((text) => <li key={text}>{text}</li>)}
          </ul>
          <p className="mt-5 border-l-2 border-brand-300 pl-4 text-lg font-medium leading-relaxed text-brand-600">{value.statement}</p>
        </div>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2">
          {value.moments.map(({ title, text, icon }, index) => (<li key={title} className="flex w-full max-w-2xl items-start gap-5 rounded-3xl bg-white p-5">
            <span aria-hidden="true" className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${iconTones[index]}`}>
              <StrokeIcon path={programIconPaths[icon]} className="size-6" />
            </span>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold leading-snug text-brand-950">{title}</h3>
              <p className="text-base leading-relaxed text-neutral-600">{text}</p>
            </div>
          </li>))}
        </ul>
      </ProgramSection>
    </div>
  );
}
