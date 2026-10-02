import { vacancySources } from "./content";

export default function VacancySources() {
  return (
    <section aria-labelledby="vacancy-sources">
      <h2 id="vacancy-sources" className="text-2xl font-semibold tracking-tight sm:text-3xl">Где искать вакансии?</h2>
      <ul className="mt-7 grid gap-4 md:grid-cols-3">
        {vacancySources.map(({ title, text }) => (
          <li key={title} className="flex gap-4 rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
            <span aria-hidden="true" className="mt-2.5 size-2 shrink-0 rounded-full bg-brand-500" />
            <div>
              <h3 className="text-lg font-semibold leading-snug">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
