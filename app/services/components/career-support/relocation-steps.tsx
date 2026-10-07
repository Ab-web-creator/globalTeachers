import SectionHeading from "../section-heading";
import SectionLabel from "../job-search/section-label";
import LineIcon from "../line-icon";
import { relocation } from "./content";
import { relocationIcons, stageTones } from "./icons";
import RelocationIllustration from "./relocation-illustration";

export default function RelocationSteps() {
  return (
    <section aria-labelledby="support-relocation" className="py-12 sm:py-16 lg:py-20">
      <div className="grid items-center gap-10 lg:grid-cols-3 lg:gap-12">
        <div className="lg:col-span-2">
          <SectionLabel>После оффера</SectionLabel>
          <SectionHeading id="support-relocation">И после предложения наша<br />работа ещё не заканчивается</SectionHeading>
          {relocation.paragraphs.map((text, index) => <p key={text} className={`${index === 0 ? "mt-7" : "mt-4"} max-w-2xl text-lg leading-relaxed text-neutral-600`}>{text}</p>)}
          <p className="mt-5 max-w-2xl border-l-2 border-brand-300 pl-4 text-lg font-medium leading-relaxed text-brand-600">{relocation.help}</p>
        </div>
        <RelocationIllustration />
      </div>
      <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {relocation.steps.map(({ title, text }, index) => (
          <li key={title} className="group flex items-start gap-4 rounded-3xl border border-brand-100 bg-white p-6 shadow-sm transition-colors duration-200 hover:border-brand-300 hover:bg-violet-50 motion-reduce:transition-none">
            <span aria-hidden="true" className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${stageTones[index]}`}>
              <LineIcon path={relocationIcons[index]} className="size-6" />
            </span>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold leading-snug text-brand-950">{title}</h3>
              <p className="mt-3 text-base leading-relaxed text-neutral-600">{text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
