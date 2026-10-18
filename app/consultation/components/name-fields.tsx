"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import RequiredMark from "./required-mark";
import type { Ref } from "react";
import type { PersonName } from "../../../lib/person-name";

const fields = [
  { name: "firstName", label: "Ваше имя", placeholder: "Например: Анна", autoComplete: "given-name" },
  { name: "lastName", label: "Ваша фамилия", placeholder: "Например: Иванова", autoComplete: "family-name" },
] as const;

type Props = {
  value: PersonName;
  onChange: (value: PersonName) => void;
  error: string;
  errorField: string;
  errorRef: Ref<HTMLParagraphElement>;
};

export default function NameFields({ value, onChange, error, errorField, errorRef }: Props) {
  const t = useTranslations();
  return (
    <div className="flex flex-col gap-6">
      {fields.map((field) => (
        <div key={field.name}>
        <label htmlFor={`consultation-${field.name}`} className="block text-sm font-medium">
          {t.content(field.label)}<RequiredMark />
          <input id={`consultation-${field.name}`} name={field.name} aria-invalid={Boolean(error && errorField === field.name)} aria-describedby={error && errorField === field.name ? "step-error" : undefined} autoComplete={field.autoComplete} value={value[field.name]} onChange={(event) => onChange({ firstName: value.firstName, lastName: value.lastName, [field.name]: event.target.value })} placeholder={t.content(field.placeholder)} required pattern=".*\S.*" maxLength={100} className="mt-2 w-full rounded-xl border border-brand-200 bg-white/80 px-4 py-3 text-base text-brand-700 placeholder:font-normal placeholder:text-neutral-400 focus:border-brand-500" />
        </label>
        {t.content(error && errorField === field.name && <p ref={errorRef} id="step-error" role="alert" className="mt-2 px-4 text-sm text-red-700">{t.content(error)}</p>)}
        </div>
      ))}
    </div>
  );
}
