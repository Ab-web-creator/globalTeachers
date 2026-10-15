"use client";

import { paymentSubjects } from "../../../lib/payment/subjects";
import SubjectSelector from "../../consultation/components/subject-selector";
import PaymentEmailDialog from "./payment-email-dialog";
import usePaymentProfile from "./use-payment-profile";
import FormSelect from "../../consultation/components/form-select";
import RequiredMark from "../../consultation/components/required-mark";
import ProgramSection from "../../programs/components/program-section";

const fieldClass = "w-full rounded-xl border border-brand-200 bg-white px-4 py-3 text-base text-brand-700 placeholder:text-neutral-400 focus:border-brand-500 focus:outline-2 focus:-outline-offset-2 focus:outline-brand-300";
const selections = [
  { name: "education", label: "Уровень образования", placeholder: "Выберите уровень образования", options: ["Среднее специальное", "Бакалавр", "Магистр", "Докторская степень", "Профессор"] },
  { name: "english", label: "Уровень английского", placeholder: "Выберите уровень английского", options: ["Не говорю по-английски", "Базовый — могу общаться на простые темы", "Средний — могу поддерживать разговор", "Уверенный — могу работать на английском"] },
] as const;

export default function PaymentDetailsSection() {
  const { email, profile, status, changeEmail, changeField, lookup, verification } = usePaymentProfile();
  return (
    <ProgramSection id="payment-details" label="Ваши данные" title="Расскажите немного о себе">
      <p className="mt-7 max-w-2xl text-lg leading-relaxed text-neutral-600">Укажите ваши контакты и информацию о подготовке к преподаванию в международной школе.</p>
      <form onSubmit={(event) => event.preventDefault()} className="payment-form mt-10">
        <div className="grid gap-6 md:grid-cols-2">
          <label htmlFor="payment-email" className="block text-sm font-medium">
            Введите ваш емайл<RequiredMark />
            <input id="payment-email" name="email" value={email} onChange={(event) => changeEmail(event.target.value)} onBlur={() => lookup()} type="email" autoComplete="email" placeholder="name@example.com" required maxLength={254} className={`${fieldClass} mt-2`} />
          </label>
          <label htmlFor="payment-name" className="block text-sm font-medium">
            Ваше имя<RequiredMark />
            <input id="payment-name" name="name" value={profile.name} onChange={(event) => changeField("name", event.target.value)} autoComplete="name" placeholder="Например: Анна Иванова" required maxLength={200} className={`${fieldClass} mt-2`} />
          </label>
          <div className="min-w-0"><SubjectSelector availableSubjects={paymentSubjects} value={profile.subject} onChange={(value) => changeField("subject", value)} /></div>
          {selections.map((field) => (
            <label key={field.name} htmlFor={`payment-${field.name}`} className="block text-sm font-medium">
              {field.label}<RequiredMark />
              <FormSelect id={`payment-${field.name}`} name={field.name} value={profile[field.name]} onChange={(event) => changeField(field.name, event.target.value)} required className={fieldClass}>
                <option value="" disabled>{field.placeholder}</option>
                {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
              </FormSelect>
            </label>
          ))}
        </div>
        <p role="status" aria-live="polite" className="mt-7 text-sm text-brand-600">{status}</p>
      </form>
      {verification.dialogOpen && <PaymentEmailDialog {...verification} />}
    </ProgramSection>
  );
}
