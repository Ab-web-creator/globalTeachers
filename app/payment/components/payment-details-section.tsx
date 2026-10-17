"use client";

import { useEffect, useEffectEvent } from "react";
import PaymentEmailDialog from "./payment-email-dialog";
import type usePaymentProfile from "./use-payment-profile";
import RequiredMark from "../../consultation/components/required-mark";
import ProgramSection from "../../programs/components/program-section";

import SubjectSelector from "../../consultation/components/subject-selector";
import FormSelect from "../../consultation/components/form-select";
import { paymentSubjects } from "../../../lib/payment/subjects";

const englishLevels = [
  "Не говорю по-английски",
  "Базовый — могу общаться на простые темы",
  "Средний — могу поддерживать разговор",
  "Уверенный — могу работать на английском",
];

const fieldClass =
  "w-full rounded-xl border border-brand-200 bg-white px-4 py-3 text-base text-brand-700 placeholder:text-neutral-400 aria-invalid:border-red-500 focus:border-brand-500 focus:outline-2 focus:-outline-offset-2 focus:outline-brand-300";
export default function PaymentDetailsSection({
  profileState,
  errors,
  highlightBeginnerEnglish,
}: {
  profileState: ReturnType<typeof usePaymentProfile>;
  errors: Record<string, string>;
  highlightBeginnerEnglish: boolean;
}) {
  const {
    email,
    profile,
    status,
    changeEmail,
    changeField,
    lookup,
    verification,
  } = profileState;
  const checkEmail = useEffectEvent(() => void lookup());

  useEffect(() => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return;
    const timer = setTimeout(() => checkEmail(), 800);
    return () => clearTimeout(timer);
  }, [email]);

  return (
    <ProgramSection
      id="payment-details"
      label="Ваши данные"
      title="Ваши контактные данные"
    >
      <p className="mt-7 max-w-2xl text-lg leading-relaxed text-neutral-600">
        Укажите ваши контактные данные, предмет и уровень английского, чтобы продолжить оформление.
      </p>
      <form
        onSubmit={(event) => event.preventDefault()}
        className="payment-form mt-10"
      >
        <div className="grid w-full gap-6 sm:grid-cols-2">
          <label htmlFor="payment-email" className="block text-sm font-medium">
            Электронная почта
            <RequiredMark />
            <input
              id="payment-email"
              aria-invalid={Boolean(errors["payment-email"])}
              aria-describedby={
                errors["payment-email"] ? "payment-email-error" : undefined
              }
              name="email"
              value={email}
              onChange={(event) => changeEmail(event.target.value)}
              onBlur={() => lookup()}
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              required
              maxLength={254}
              className={`${fieldClass} mt-2`}
            />
            {errors["payment-email"] && (
              <span
                id="payment-email-error"
                className="mt-2 block text-sm font-normal text-red-700"
              >
                {errors["payment-email"]}
              </span>
            )}
          </label>
          <label htmlFor="payment-name" className="block text-sm font-medium">
            Ваше имя
            <RequiredMark />
            <input
              id="payment-name"
              aria-invalid={Boolean(errors["payment-name"])}
              aria-describedby={
                errors["payment-name"] ? "payment-name-error" : undefined
              }
              name="name"
              value={profile.name}
              onChange={(event) => changeField("name", event.target.value)}
              autoComplete="name"
              placeholder="Например: Анна Иванова"
              required
              maxLength={200}
              className={`${fieldClass} mt-2`}
            />
            {errors["payment-name"] && (
              <span
                id="payment-name-error"
                className="mt-2 block text-sm font-normal text-red-700"
              >
                {errors["payment-name"]}
              </span>
            )}
          </label>
          <label htmlFor="payment-english" className="block text-sm font-medium">
            Уровень английского
            <RequiredMark />
            <FormSelect
              id="payment-english"
              name="english"
              value={profile.english}
              onChange={(event) => changeField("english", event.target.value)}
              required
              aria-invalid={Boolean(errors["payment-english"])}
              aria-describedby={errors["payment-english"] ? "payment-english-error" : undefined}
              className={fieldClass}
            >
              <option value="" disabled>Выберите уровень английского</option>
              {englishLevels.map((level, index) => (
                <option
                  key={level}
                  value={level}
                  className={highlightBeginnerEnglish && index < 2 ? "text-red-700" : "text-brand-700"}
                >
                  {highlightBeginnerEnglish ? level.split(" — ")[0] : level}{highlightBeginnerEnglish && index < 2 ? " — для этой программы требуется более высокий уровень" : ""}
                </option>
              ))}
            </FormSelect>
            {errors["payment-english"] && (
              <span id="payment-english-error" className="mt-2 block text-sm font-normal text-red-700">
                {errors["payment-english"]}
              </span>
            )}
          </label>
          <SubjectSelector
            id="payment-subject"
            label="Ваш предмет"
            value={profile.subject}
            onChange={(value) => changeField("subject", value)}
            availableSubjects={paymentSubjects}
            error={errors["payment-subject"]}
          />
        </div>
        {status && (
          <p
            role="status"
            aria-live="polite"
            className="mt-7 text-sm text-brand-600"
          >
            {status}
          </p>
        )}
      </form>
      {verification.dialogOpen && <PaymentEmailDialog {...verification} />}
    </ProgramSection>
  );
}
