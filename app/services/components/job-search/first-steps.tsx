import { firstSteps } from "./content";
import GuideIcon, { type GuideIconName } from "./guide-icon";

const icons: GuideIconName[] = ["document", "globe", "document", "search", "send"];

export default function FirstSteps() {
  return (
    <section aria-labelledby="job-search-first-steps">
      <h2 id="job-search-first-steps" className="text-2xl font-semibold tracking-tight sm:text-3xl">С чего начать?</h2>
      <ol className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {firstSteps.map((text, index) => (
          <li key={text} className="relative rounded-2xl border border-brand-100 bg-white p-5 shadow-sm">
            <div aria-hidden="true" className="mb-5 flex items-center justify-between text-brand-500">
              <span className="flex size-9 items-center justify-center rounded-full bg-brand-500/5 text-sm font-semibold">{String(index + 1).padStart(2, "0")}</span>
              <GuideIcon name={icons[index]} className="size-6" />
            </div>
            <p className="text-sm font-medium leading-relaxed">{text}</p>
            {index < firstSteps.length - 1 && <span aria-hidden="true" className="absolute top-1/2 -right-3 z-10 hidden text-brand-500 lg:block">→</span>}
          </li>
        ))}
      </ol>
    </section>
  );
}
