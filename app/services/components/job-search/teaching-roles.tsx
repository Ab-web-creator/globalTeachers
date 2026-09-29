import { teachingRoles } from "./content";
import GuideIcon from "./guide-icon";

export default function TeachingRoles() {
  return (
    <section aria-labelledby="teaching-roles">
      <h2 id="teaching-roles" className="text-2xl font-semibold tracking-tight sm:text-3xl">Что искать?</h2>
      <p className="mt-4 leading-relaxed text-neutral-600">Названия должностей могут отличаться от привычных вам.</p>
      <p className="mt-3 text-neutral-600">Например:</p>
      <div className="mt-5 grid gap-6 md:grid-cols-3">
        <dl className="divide-y divide-brand-100 rounded-2xl border border-brand-100 bg-white px-5 shadow-sm sm:px-7 md:col-span-2">
          {teachingRoles.map(([russian, english]) => (
            <div key={russian} className="grid gap-2 py-4 text-sm sm:grid-cols-2 sm:gap-4">
              <dt className="text-neutral-600">{russian}</dt>
              <dd className="flex gap-3 font-medium text-brand-500"><span aria-hidden="true">→</span>{english}</dd>
            </div>
          ))}
        </dl>
        <aside className="relative overflow-hidden rounded-2xl bg-linear-to-br from-brand-500/5 to-brand-300/20 p-7">
          <GuideIcon name="book" className="size-9 text-brand-500" />
          <p className="relative z-10 mt-5 leading-relaxed text-neutral-600">Поэтому при поиске важно знать международное название своей специальности.</p>
          <GuideIcon name="book" className="absolute -right-5 -bottom-6 size-32 -rotate-12 text-brand-500/5" />
        </aside>
      </div>
    </section>
  );
}
