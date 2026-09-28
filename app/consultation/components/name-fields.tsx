import RequiredMark from "./required-mark";
import type { Ref } from "react";

export type TeacherName = { firstName: string; lastName: string };

const fields = [
  { name: "firstName", label: "Ваше имя", placeholder: "Например: Анна", autoComplete: "given-name" },
  { name: "lastName", label: "Ваша фамилия", placeholder: "Например: Иванова", autoComplete: "family-name" },
] as const;

type Props = {
  value: TeacherName;
  onChange: (value: TeacherName) => void;
  error: string;
  errorField: string;
  errorRef: Ref<HTMLParagraphElement>;
};

export default function NameFields({ value, onChange, error, errorField, errorRef }: Props) {
  return (
    <div className="flex flex-col gap-6">
      {fields.map((field) => (
        <div key={field.name}>
        <label htmlFor={`consultation-${field.name}`} className="block text-sm font-medium">
          {field.label}<RequiredMark />
          <input id={`consultation-${field.name}`} name={field.name} aria-invalid={Boolean(error && errorField === field.name)} aria-describedby={error && errorField === field.name ? "step-error" : undefined} autoComplete={field.autoComplete} value={value[field.name]} onChange={(event) => onChange({ ...value, [field.name]: event.target.value })} placeholder={field.placeholder} required pattern=".*\S.*" maxLength={100} className="mt-2 w-full rounded-xl border border-brand-200 bg-white/80 px-4 py-3 text-base text-brand-700 placeholder:text-neutral-400 focus:border-brand-500" />
        </label>
        {error && errorField === field.name && <p ref={errorRef} id="step-error" role="alert" className="mt-2 px-4 text-sm text-red-700">{error}</p>}
        </div>
      ))}
    </div>
  );
}
