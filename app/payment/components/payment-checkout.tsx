"use client";

import { useState } from "react";
import type { Program } from "../../components/home/categories/programs";
import PaymentDetailsSection from "./payment-details-section";
import PaymentSection from "./payment-section";
import usePaymentCase from "./use-payment-case";
import usePaymentProfile from "./use-payment-profile";
import { englishNotice, isBeginnerEnglish } from "../../consultation/components/english-notice";
import PaymentEnglishDialog from "./payment-english-dialog";

export default function PaymentCheckout({ program }: { program: Program }) {
  const [attempted, setAttempted] = useState(false);
  const [englishNoticeOpen, setEnglishNoticeOpen] = useState(false);
  const profileState = usePaymentProfile();
  const { email, profile } = profileState;
  const requiresEnglish = program.tier === "PRO" || program.tier === "VIP";
  const englishRestricted = requiresEnglish && isBeginnerEnglish(profile.english);
  const registration = usePaymentCase(email, profile, program.tier);
  const errors: Record<string, string> = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    errors["payment-email"] = "Укажите корректный адрес электронной почты.";
  if (!profile.subject.trim()) errors["payment-subject"] = "Выберите ваш предмет.";
  if (!profile.firstName.trim()) errors["payment-first-name"] = "Укажите ваше имя.";
  if (!profile.lastName.trim()) errors["payment-last-name"] = "Укажите вашу фамилию.";
  if (!profile.english.trim()) errors["payment-english"] = "Выберите ваш уровень английского.";
  else if (englishRestricted) errors["payment-english"] = englishNotice.reason;
  const detailsComplete = Object.keys(errors).length === 0;

  function validateDetails() {
    setAttempted(true);
    if (englishRestricted) setEnglishNoticeOpen(true);
    return Object.keys(errors)[0] ?? null;
  }

  return (
    <>
      <PaymentDetailsSection
        showGradient={program.tier === "VIP"}
        highlightBeginnerEnglish={requiresEnglish}
        profileState={{
          ...profileState,
          changeField: (name, value) => {
            profileState.changeField(name, value);
            if (name === "english" && requiresEnglish && isBeginnerEnglish(value)) {
              setEnglishNoticeOpen(true);
            }
          },
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
      {englishNoticeOpen && <PaymentEnglishDialog onClose={() => setEnglishNoticeOpen(false)} />}
    </>
  );
}
