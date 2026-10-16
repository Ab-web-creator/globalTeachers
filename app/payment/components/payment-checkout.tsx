"use client";

import { useState } from "react";
import type { Program } from "../../components/home/categories/programs";
import PaymentDetailsSection from "./payment-details-section";
import PaymentSection from "./payment-section";
import usePaymentCase from "./use-payment-case";
import usePaymentProfile from "./use-payment-profile";

export default function PaymentCheckout({ program }: { program: Program }) {
  const [attempted, setAttempted] = useState(false);
  const profileState = usePaymentProfile();
  const { email, profile } = profileState;
  const registration = usePaymentCase(email, profile, program.tier);
  const errors: Record<string, string> = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    errors["payment-email"] = "Укажите корректный адрес электронной почты.";
  if (!profile.name.trim()) errors["payment-name"] = "Укажите ваше имя.";
  const detailsComplete = Object.keys(errors).length === 0;

  function validateDetails() {
    setAttempted(true);
    return Object.keys(errors)[0] ?? null;
  }

  return (
    <>
      <PaymentDetailsSection
        profileState={{
          ...profileState,
          lookup: (address = email) =>
            profileState.lookup(address, registration.getCaseId(address)),
        }}
        errors={attempted ? errors : {}}
      />
      {registration.error && (
        <div
          role="alert"
          className="mx-auto max-w-400 px-6 py-4 text-base text-red-700 sm:px-10 lg:px-16 xl:px-20"
        >
          {registration.error}{" "}
          <button
            type="button"
            onClick={registration.retry}
            className="underline"
          >
            Повторить сохранение
          </button>
        </div>
      )}
      <PaymentSection
        program={program}
        detailsComplete={detailsComplete}
        validateDetails={validateDetails}
      />
    </>
  );
}
