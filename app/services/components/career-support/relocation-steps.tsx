import CareerSupportBanner from "./career-support-banner";
import SectionHeading from "../section-heading";
import SectionLabel from "../job-search/section-label";
import LineIcon from "../line-icon";
import { relocation } from "./content";
import { relocationIcons } from "./icons";

export default function RelocationSteps() {
  return (
    <section aria-labelledby="support-relocation" className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div>
        <SectionLabel>После оффера</SectionLabel>
        <SectionHeading id="support-relocation">И после предложения наша работа ещё не заканчивается</SectionHeading>
        {relocation.paragraphs.map((text, index) => <p key={text} className={`mt-4 leading-relaxed text-neutral-600 ${index === 0 ? "text-lg" : ""}`}>{text}</p>)}
        <p className="mt-6 text-lg leading-relaxed text-brand-600">{relocation.help}</p>
      </div>
      <div className="relative">
        <span aria-hidden="true" className="absolute top-8 bottom-8 left-11 w-px bg-brand-200" />
        <ol className="space-y-3">
          {relocation.steps.map((step, index) => (
            <li key={step} className="relative flex items-center gap-5 rounded-2xl border border-brand-100 bg-white px-5 py-4">
              <span aria-hidden="true" className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <LineIcon path={relocationIcons[index]} className="size-6" />
              </span>
              <span className="text-lg font-medium text-brand-950">{step}</span>
              <span aria-hidden="true" className="ml-auto text-sm font-semibold tabular-nums text-brand-300">{String(index + 1).padStart(2, "0")}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="mt-2 lg:col-span-2"><CareerSupportBanner /></div>
    </section>
  );
}
