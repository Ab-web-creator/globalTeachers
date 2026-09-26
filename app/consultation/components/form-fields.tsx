import type { ChangeEvent } from "react";

export type Answers = {
  name: string; country: string; email: string; contact: string;
  subject: string; experience: string; english: string;
  destinations: string; timing: string; goals: string;
};
export const emptyAnswers: Answers = {
  name: "", country: "", email: "", contact: "", subject: "", experience: "", english: "", destinations: "", timing: "", goals: "",
};
const fieldClass = "mt-2 w-full rounded-xl border border-brand-200 bg-white/80 px-4 py-3 text-base text-brand-700 placeholder:text-neutral-400 focus:border-brand-500 focus:outline-2 focus:outline-brand-300";
type Field = { name: keyof Answers; label: string; placeholder?: string; type?: string; autocomplete?: string; options?: string[]; multiline?: boolean; optional?: boolean };
const fields: Field[][] = [
  [
    { name: "name", label: "Имя и фамилия", placeholder: "Например, Анна Иванова", autocomplete: "name" },
    { name: "country", label: "Страна проживания", placeholder: "В какой стране вы живёте?", autocomplete: "country-name" },
    { name: "email", label: "Email", placeholder: "you@example.com", type: "email", autocomplete: "email" },
    { name: "contact", label: "WhatsApp / Telegram (необязательно)", placeholder: "Номер с кодом страны или @username", optional: true },
  ],
  [
    { name: "subject", label: "Ваш предмет или специализация", placeholder: "Например, математика, начальные классы" },
    { name: "experience", label: "Педагогический стаж", options: ["Пока нет опыта", "Менее 1 года", "1–3 года", "4–7 лет", "8 лет и больше"] },
    { name: "english", label: "Уровень английского", options: ["Начальный (A1–A2)", "Средний (B1)", "Выше среднего (B2)", "Продвинутый (C1–C2)", "Не знаю свой уровень"] },
  ],
  [
    { name: "destinations", label: "Какие страны вас интересуют?", placeholder: "Укажите страны или «Пока выбираю»" },
    { name: "timing", label: "Когда планируете начать?", options: ["Как можно скорее", "В ближайшие 3–6 месяцев", "В течение года", "Пока изучаю возможности"] },
    { name: "goals", label: "Что хотите обсудить?", placeholder: "Расскажите о своих целях и вопросах", multiline: true },
  ],
];

export default function FormFields({ step, answers, onChange }: { step: number; answers: Answers; onChange: (name: keyof Answers, value: string) => void }) {
  function update(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    onChange(event.target.name as keyof Answers, event.target.value);
  }
  return (
    <div className="space-y-4">
      {fields[step].map((field) => (
        <label key={field.name} className="block text-sm font-medium" htmlFor={`consultation-${field.name}`}>
          {field.label}
          {field.options ? (
            <select id={`consultation-${field.name}`} name={field.name} value={answers[field.name]} onChange={update} required className={fieldClass}>
              <option value="" disabled>Выберите вариант</option>
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
