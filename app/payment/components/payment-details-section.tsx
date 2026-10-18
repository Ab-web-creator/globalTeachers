"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
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

const nameFields = [
  { name: "firstName", id: "payment-first-name", label: "Ваше имя", placeholder: "Например: Анна", autoComplete: "given-name" },
  { name: "lastName", id: "payment-last-name", label: "Ваша фамилия", placeholder: "Например: Иванова", autoComplete: "family-name" },
] as const;

const fieldClass =
  "w-full rounded-xl border border-brand-200 bg-white px-4 py-3 text-base font-normal text-brand-700 placeholder:text-neutral-500 aria-invalid:border-red-500 focus:border-brand-500 focus:outline-2 focus:-outline-offset-2 focus:outline-brand-300";
export default function PaymentDetailsSection({
  profileState,
  errors,
  highlightBeginnerEnglish,
  showGradient = false,
}: {
  profileState: ReturnType<typeof usePaymentProfile>;
  errors: Record<string, string>;
  highlightBeginnerEnglish: boolean;
  showGradient?: boolean;
}) {
  const t = useTranslations();
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
      label={t("payment.paymentDetailsSection.message1036")}
      title={t("payment.paymentDetailsSection.message1037")}
      fade={showGradient ? "sky" : undefined}
      fadeDirection="down"
      fadeToWhite
    >
      <p className="mt-7 max-w-2xl text-lg leading-relaxed text-neutral-600">
        {t("payment.paymentDetailsSection.message1038")}</p>
      <form
        onSubmit={(event) => event.preventDefault()}
        className="payment-form mt-10"
      >
        <div className="grid w-full gap-6 sm:grid-cols-2">
          <label htmlFor="payment-email" className="block text-sm font-medium">
            {t("payment.paymentDetailsSection.message1039")}<RequiredMark />
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
            {t.content(errors["payment-email"] && (
              <span
                id="payment-email-error"
                className="mt-2 block text-sm font-normal text-red-700"
              >
                {t.content(errors["payment-email"])}
              </span>
            ))}
          </label>
          <SubjectSelector
            id="payment-subject"
            label={t("consultation.consultationSteps.message0498")}
            value={profile.subject}
            onChange={(value) => changeField("subject", value)}
            availableSubjects={paymentSubjects}
            error={errors["payment-subject"]}
            placeholderClassName="text-neutral-500"
          />
          {nameFields.map((field) => (
            <label key={field.name} htmlFor={field.id} className="block text-sm font-medium">
              {t.content(field.label)}
              <RequiredMark />
              <input
                id={field.id}
                aria-invalid={Boolean(errors[field.id])}
                aria-describedby={errors[field.id] ? `${field.id}-error` : undefined}
                name={field.name}
                value={profile[field.name]}
                onChange={(event) => changeField(field.name, event.target.value)}
                autoComplete={field.autoComplete}
                placeholder={t.content(field.placeholder)}
                required
                maxLength={100}
                className={`${fieldClass} mt-2`}
              />
              {t.content(errors[field.id] && (
                <span
                  id={`${field.id}-error`}
                  className="mt-2 block text-sm font-normal text-red-700"
                >
                  {t.content(errors[field.id])}
                </span>
              ))}
            </label>
          ))}
          <label htmlFor="payment-english" className="block text-sm font-medium">
            {t("payment.paymentDetailsSection.message1040")}<RequiredMark />
            <FormSelect
              id="payment-english"
              name="english"
              value={profile.english}
              onChange={(event) => changeField("english", event.target.value)}
              required
              aria-invalid={Boolean(errors["payment-english"])}
              aria-describedby={errors["payment-english"] ? "payment-english-error" : undefined}
              className={`${fieldClass} invalid:text-neutral-500`}
            >
              <option value="" disabled>{t("payment.paymentDetailsSection.message1041")}</option>
              {englishLevels.map((level, index) => (
                <option
                  key={level}
                  value={level}
                  className={highlightBeginnerEnglish && index < 2 ? "text-red-700" : "text-brand-700"}
                >
                  {highlightBeginnerEnglish ? t.content(level).split(" — ")[0] : t.content(level)}{t.content(highlightBeginnerEnglish && index < 2 ? " — для этой программы требуется более высокий уровень" : "")}
                </option>
              ))}
            </FormSelect>
            {t.content(errors["payment-english"] && (
              <span id="payment-english-error" className="mt-2 block text-sm font-normal text-red-700">
                {t.content(errors["payment-english"])}
              </span>
            ))}
          </label>
        </div>
        {t.content(status && (
          <p
            role="status"
            aria-live="polite"
            className="mt-7 text-sm text-brand-600"
          >
            {t.content(status)}
          </p>
        ))}
      </form>
      {verification.dialogOpen && <PaymentEmailDialog {...verification} />}
    </ProgramSection>
  );
}
