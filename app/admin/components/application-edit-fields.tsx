import type { Answers } from "../../consultation/components/form-fields";
import { answerLabels } from "../../../lib/consultation/answers";
import ApplicationSubjectChoices from "./application-subject-choices";

const controlClass = "mt-2 block w-full rounded-xl border border-brand-200 bg-white px-3 py-2 text-sm font-normal focus:outline-2 focus:-outline-offset-2 focus:outline-brand-500";

export default function ApplicationEditFields({ answers, onChange }: { answers: Answers; onChange: (name: keyof Answers, value: string) => void }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {(Object.keys(answerLabels) as (keyof Answers)[]).map((name) => name === "subject" ? (
        <ApplicationSubjectChoices key={name} value={answers.subject} onChange={(value) => onChange("subject", value)} />
      ) : (
        <label key={name} className={`block text-sm font-medium ${name === "goals" ? "sm:col-span-2" : ""}`}>
          {answerLabels[name]}{name === "contact" || name === "goals" ? " (необязательно)" : ""}
          {name === "goals" ? (
            <textarea name={name} value={answers[name]} onChange={(event) => onChange(name, event.target.value)} rows={5} maxLength={1500} className={controlClass} />
          ) : (
            <input name={name} type={name === "email" ? "email" : "text"} value={answers[name]} onChange={(event) => onChange(name, event.target.value)} required={name !== "contact"} maxLength={300} className={controlClass} />
          )}
        </label>
      ))}
    </div>
  );
}
