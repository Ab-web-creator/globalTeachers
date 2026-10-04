import { subjectNameExamples } from "./content";

export default function SubjectNames() {
  return (
    <ul className="-mt-3 divide-y divide-brand-100">
      {subjectNameExamples.map(([russian, english]) => (
        <li key={english} className="flex flex-col gap-0.5 py-1.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-2">
          <span className="text-brand-800">{russian}</span>
          <span aria-hidden="true" className="hidden h-1 min-w-6 flex-1 bg-[radial-gradient(circle,var(--color-neutral-400)_1px,transparent_1.5px)] bg-size-[10px_4px] bg-repeat-x sm:block" />
          <span className="text-brand-600 sm:text-right">{english}</span>
        </li>
      ))}
    </ul>
  );
}
