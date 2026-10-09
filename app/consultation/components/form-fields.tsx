import type { ChangeEvent } from "react";
import PlansFields from "./plans-fields";
import ExperienceFields from "./experience-fields";
import { consultationSteps } from "./consultation-steps";
import { countries } from "./countries";
import RequiredMark from "./required-mark";
import FormSelect from "./form-select";

export type Answers = {
  name: string; country: string; email: string; contact: string;
  subject: string; experience: string; education: string; qualification: string; international: string;
  english: string; priority: string; destinations: string; timing: string; goals: string;
};
export const emptyAnswers: Answers = {
  name: "", country: "", email: "", contact: "", subject: "", experience: "", education: "", qualification: "", international: "", english: "Не говорю по-английски", priority: "", destinations: "", timing: "", goals: "",
};
const fieldClass = "w-full rounded-xl border border-brand-200 bg-white/80 px-4 py-3 text-base text-brand-700 placeholder:font-normal placeholder:text-neutral-400 focus:border-brand-500 focus:outline-1 focus:-outline-offset-2 focus:outline-brand-300";
type Field = { name: keyof Answers; label: string; placeholder?: string; type?: string; autocomplete?: string; options?: string[]; multiline?: boolean; optional?: boolean };
const fields: Field[] = [
  { name: "country", label: "Страна проживания", placeholder: "Выберите страну", autocomplete: "country-name", options: countries },
  { name: "email", label: "Email", placeholder: "name@example.com", type: "email", autocomplete: "email" },
];

export default function FormFields({ step, answers, onChange }: { step: number; answers: Answers; onChange: (name: keyof Answers, value: string) => void }) {
  function update(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    onChange(event.target.name as keyof Answers, event.target.value);
  }
  const names: readonly string[] = consultationSteps[step].fields;
  return (
    <div className="flex min-w-0 flex-col gap-6">
      {fields.filter((field) => names.includes(field.name)).map((field) => (
        <label key={field.name} className="block text-sm font-medium" htmlFor={`consultation-${field.name}`}>
          {field.label}{field.optional ? <span className="font-normal text-neutral-500"> (необязательно)</span> : <RequiredMark />}
          {field.options ? (
            <FormSelect id={`consultation-${field.name}`} name={field.name} value={answers[field.name]} onChange={update} autoComplete={field.autocomplete} required className={fieldClass}>
              <option value="" disabled>{field.placeholder ?? "Выберите вариант"}</option>
              {field.options.map((option) => <option key={option}>{option}</option>)}
            </FormSelect>
          ) : field.multiline ? (
            <textarea id={`consultation-${field.name}`} name={field.name} value={answers[field.name]} onChange={update} placeholder={field.placeholder} required rows={3} maxLength={1500} className={`${fieldClass} mt-2 resize-y`} />
          ) : (
            <input id={`consultation-${field.name}`} name={field.name} type={field.type ?? "text"} autoComplete={field.autocomplete} value={answers[field.name]} onChange={update} placeholder={field.placeholder} required={!field.optional} maxLength={200} pattern={field.type === "email" ? undefined : field.optional ? undefined : ".*\\S.*"} className={`${fieldClass} mt-2`} />
          )}
        </label>
      ))}
      <ExperienceFields names={names} answers={answers} onChange={onChange} />
      <PlansFields names={names} answers={answers} onChange={onChange} />
    </div>
  );
}
