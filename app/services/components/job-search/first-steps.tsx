import { firstSteps } from "./content";

export default function FirstSteps() {
  return (
    <section aria-labelledby="job-search-first-steps">
      <h2 id="job-search-first-steps" className="text-2xl font-semibold tracking-tight sm:text-3xl">С чего начать?</h2>
      <ul className="mt-7 space-y-4">
        {firstSteps.map(({ text }) => (
          <li key={text} className="flex gap-4">
            <span aria-hidden="true" className="mt-2 size-2 shrink-0 rounded-full bg-brand-500" />
            <p className="text-sm leading-relaxed text-neutral-600">{text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
