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
        {relocation.paragraphs.map((text, index) => <p key={text} className={`${index === 0 ? "mt-7" : "mt-4"} text-lg leading-relaxed text-neutral-600`}>{text}</p>)}
        <p className="mt-6 text-lg leading-relaxed text-brand-600">{relocation.help}</p>
      </div>
      <div className="relative lg:w-4/5 lg:justify-self-end">
        <span aria-hidden="true" className="absolute top-8 bottom-8 left-11 w-2.5 -translate-x-1/2 bg-brand-200" />
        <ol className="space-y-3">
          {relocation.steps.map((step, index) => (
            <li key={step} className="group relative flex items-center gap-5 rounded-2xl border border-brand-100 bg-white px-5 py-4 transition-colors duration-200 hover:border-brand-300 hover:bg-violet-50 motion-reduce:transition-none">
              <span aria-hidden="true" className="flex size-12 shrink-0 items-center justify-center rounded-full border border-transparent bg-brand-50 text-brand-600 transition-colors duration-200 group-hover:border-brand-400 motion-reduce:transition-none">
                <LineIcon path={relocationIcons[index]} className="size-6" />
              </span>
              <span className="text-lg font-medium text-brand-950">{step}</span>
              <span aria-hidden="true" className="ml-auto text-sm font-semibold tabular-nums text-brand-300 transition-colors duration-200 group-hover:text-brand-500 motion-reduce:transition-none">{String(index + 1).padStart(2, "0")}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="mt-2 lg:col-span-2"><CareerSupportBanner /></div>
    </section>
  );
}
