import { teachingRoles } from "./content";

export default function TeachingRoles() {
  return (
    <section aria-labelledby="teaching-roles">
      <h2 id="teaching-roles" className="text-2xl font-semibold tracking-tight sm:text-3xl">Что искать?</h2>
      <p className="mt-4 max-w-[65ch] leading-relaxed text-neutral-600">
        Названия должностей могут отличаться от привычных вам. Например:{" "}
        {teachingRoles.map(([russian, english], index) => (
          <span key={russian}>
            {index > 0 && ", "}
            {russian} <span aria-hidden="true">→</span> {english}
          </span>
        ))}
        .
      </p>
    </section>
  );
}
