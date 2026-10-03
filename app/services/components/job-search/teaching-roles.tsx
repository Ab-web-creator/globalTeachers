import { internationalTeachingRoles, teachingRoles } from "./content";

export default function TeachingRoles() {
  return (
    <section aria-labelledby="teaching-roles">
      <h2 id="teaching-roles" className="text-2xl font-semibold tracking-tight sm:text-3xl">Какие вакансии искать за рубежом?</h2>
      <p className="mt-4 max-w-[65ch] leading-relaxed text-neutral-600">
        Названия должностей могут отличаться от привычных вам. Например:
      </p>
      <div className="mt-6 max-w-prose space-y-6 text-base leading-relaxed text-neutral-600">
        <ul className="space-y-2">
          {teachingRoles.map(([russian, english]) => (
            <li key={russian}>{russian} — {english}</li>
          ))}
        </ul>
        <p>или наоборот</p>
        <ul className="space-y-2">
          {internationalTeachingRoles.map(([english, russian]) => (
            <li key={english}>{english} — {russian}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
