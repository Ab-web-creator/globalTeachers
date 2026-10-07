import IconPanel from "./icon-panel";
import { reviewQuestions } from "./content";

export default function ReviewChecklist() {
  return (
    <IconPanel as="div" id="cv-review" title="Перед отправкой проверьте" icon="checklist" tone="white">
      <ol className="mt-5 space-y-2.5 text-lg">
        {reviewQuestions.map((question, index) => (
          <li key={question} className="flex items-baseline gap-4 leading-relaxed text-neutral-600">
            <span aria-hidden="true" className="font-semibold tabular-nums text-brand-500">{String(index + 1).padStart(2, "0")}</span>
            {question}
          </li>
        ))}
      </ol>
    </IconPanel>
  );
}
