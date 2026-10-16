"use client";

import { useEffect, useEffectEvent } from "react";
import PaymentEmailDialog from "./payment-email-dialog";
import type usePaymentProfile from "./use-payment-profile";
import RequiredMark from "../../consultation/components/required-mark";
import ProgramSection from "../../programs/components/program-section";

const fieldClass =
  "w-full rounded-xl border border-brand-200 bg-white px-4 py-3 text-base text-brand-700 placeholder:text-neutral-400 aria-invalid:border-red-500 focus:border-brand-500 focus:outline-2 focus:-outline-offset-2 focus:outline-brand-300";
export default function PaymentDetailsSection({
  profileState,
  errors,
}: {
  profileState: ReturnType<typeof usePaymentProfile>;
  errors: Record<string, string>;
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
        Укажите ваше имя и адрес электронной почты, чтобы продолжить оформление.
      </p>
      <form
        onSubmit={(event) => event.preventDefault()}
        className="payment-form mt-10"
      >
        <div className="grid max-w-xl gap-6">
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
