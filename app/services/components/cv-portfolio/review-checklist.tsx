import SectionHeading from "../section-heading";
import { reviewQuestions } from "./content";

export default function ReviewChecklist() {
  return (
    <section aria-labelledby="cv-review" className="rounded-3xl border border-brand-200 bg-white/60 p-6 sm:p-8">
      <SectionHeading id="cv-review" size="small">Перед отправкой проверьте</SectionHeading>
      <span aria-hidden="true" className="mt-4 block h-1 w-24 rounded-full bg-brand-400" />
      <ol className="mt-5 space-y-2.5">
        {reviewQuestions.map((question, index) => (
          <li key={question} className="flex items-baseline gap-4 leading-relaxed text-neutral-600">
            <span aria-hidden="true" className="font-semibold tabular-nums text-brand-500">{String(index + 1).padStart(2, "0")}</span>
            {question}
          </li>
        ))}
      </ol>
    </section>
  );
}
