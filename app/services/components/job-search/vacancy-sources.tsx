import SectionLabel from "./section-label";
import { vacancySources } from "./content";
import RegionMap from "./region-map";

export default function VacancySources() {
  return (
    <section aria-labelledby="vacancy-sources">
      <SectionLabel>Источники вакансий</SectionLabel>
      <h2 id="vacancy-sources" className="text-3xl font-semibold tracking-tight sm:text-4xl">Так где же искать вакансии?</h2>
      <div className="mt-7 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <ul className="space-y-6">
          {vacancySources.map(({ title, text }) => (
            <li key={title} className="flex gap-4">
              <span aria-hidden="true" className="mt-2.5 size-2 shrink-0 rounded-full bg-brand-500" />
              <div>
                <h3 className="text-lg font-semibold leading-snug">{title}</h3>
                <p className="mt-1.5 text-base leading-relaxed text-neutral-600">{text}</p>
              </div>
            </li>
          ))}
        </ul>
        <RegionMap />
      </div>
    </section>
  );
}
