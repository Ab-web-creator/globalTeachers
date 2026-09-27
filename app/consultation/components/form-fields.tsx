import type { ChangeEvent } from "react";
import PlansFields from "./plans-fields";
import ExperienceFields from "./experience-fields";
import { countries } from "./countries";

export type Answers = {
  name: string; country: string; email: string; contact: string;
  subject: string; experience: string; education: string; qualification: string; international: string;
  english: string; priority: string; destinations: string; timing: string; goals: string;
};
export const emptyAnswers: Answers = {
  name: "", country: "", email: "", contact: "", subject: "", experience: "", education: "", qualification: "", international: "", english: "", priority: "", destinations: "", timing: "", goals: "",
};
const fieldClass = "mt-2 w-full rounded-xl border border-brand-200 bg-white/80 px-4 py-3 text-base text-brand-700 placeholder:text-neutral-400 focus:border-brand-500 focus:outline-2 focus:outline-brand-300";
type Field = { name: keyof Answers; label: string; placeholder?: string; type?: string; autocomplete?: string; options?: string[]; multiline?: boolean; optional?: boolean };
const fields: Field[][] = [
  [
    { name: "name", label: "Имя и фамилия", placeholder: "Анна Иванова", autocomplete: "name" },
    { name: "country", label: "Страна проживания", placeholder: "Выберите страну", autocomplete: "country-name", options: countries },
    { name: "email", label: "Email", placeholder: "name@email.com", type: "email", autocomplete: "email" },
    { name: "contact", label: "WhatsApp / Telegram", placeholder: "Номер телефона или @username", optional: true },
  ],
  [],
  [],
];

export default function FormFields({ step, answers, onChange }: { step: number; answers: Answers; onChange: (name: keyof Answers, value: string) => void }) {
  function update(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    onChange(event.target.name as keyof Answers, event.target.value);
  }
  if (step === 2) return <PlansFields answers={answers} onChange={onChange} />;
  if (step === 1) return <ExperienceFields answers={answers} onChange={onChange} />;
  return (
    <div className="space-y-4">
      {fields[step].map((field) => (
        <label key={field.name} className="block text-sm font-medium" htmlFor={`consultation-${field.name}`}>
          {field.label}
          {field.options ? (
            <select id={`consultation-${field.name}`} name={field.name} value={answers[field.name]} onChange={update} autoComplete={field.autocomplete} required className={fieldClass}>
              <option value="" disabled>{field.placeholder ?? "Выберите вариант"}</option>
              {field.options.map((option) => <option key={option}>{option}</option>)}
            </select>
          ) : field.multiline ? (
            <textarea id={`consultation-${field.name}`} name={field.name} value={answers[field.name]} onChange={update} placeholder={field.placeholder} required rows={3} maxLength={1500} className={`${fieldClass} resize-y`} />
          ) : (
            <input id={`consultation-${field.name}`} name={field.name} type={field.type ?? "text"} autoComplete={field.autocomplete} value={answers[field.name]} onChange={update} placeholder={field.placeholder} required={!field.optional} maxLength={200} pattern={field.type === "email" ? undefined : field.optional ? undefined : ".*\\S.*"} className={fieldClass} />
          )}
        </label>
      ))}
    </div>
  );
}
