import { vacancySources } from "./content";
import GuideIcon, { type GuideIconName } from "./guide-icon";

const icons: GuideIconName[] = ["monitor", "globe", "people"];

export default function VacancySources() {
  return (
    <section aria-labelledby="vacancy-sources">
      <h2 id="vacancy-sources" className="text-2xl font-semibold tracking-tight sm:text-3xl">Где искать вакансии?</h2>
      <div className="mt-7 grid gap-5 md:grid-cols-3">
        {vacancySources.map(({ title, text, example }, index) => (
          <div key={title} className="rounded-2xl border border-brand-100 bg-white p-6 text-center shadow-sm sm:p-7">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-brand-500/5 text-brand-500 ring-8 ring-brand-50"><GuideIcon name={icons[index]} className="size-9" /></div>
            <h3 className="mt-7 text-lg font-semibold">{title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">{text}</p>
            {example && <p className="mt-4 text-sm leading-relaxed text-brand-500">{example}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
