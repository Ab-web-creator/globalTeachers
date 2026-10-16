"use client";

import { useState } from "react";
import type { Program } from "../../components/home/categories/programs";
import PaymentDetailsSection from "./payment-details-section";
import PaymentSection from "./payment-section";
import usePaymentProfile from "./use-payment-profile";

export default function PaymentCheckout({ program }: { program: Program }) {
  const [attempted, setAttempted] = useState(false);
  const profileState = usePaymentProfile();
  const { email, profile } = profileState;
  const errors: Record<string, string> = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors["payment-email"] = "Укажите корректный адрес электронной почты.";
  if (!profile.name.trim()) errors["payment-name"] = "Укажите ваше имя.";
  if (!profile.subject.trim()) errors["payment-subject"] = "Выберите хотя бы один преподаваемый предмет.";
  if (!profile.education.trim()) errors["payment-education"] = "Выберите уровень образования.";
  if (!profile.english.trim()) errors["payment-english"] = "Выберите уровень английского.";
  const detailsComplete = Object.keys(errors).length === 0;

  function validateDetails() {
    setAttempted(true);
    return Object.keys(errors)[0] ?? null;
  }

  return (
    <>
      <PaymentDetailsSection profileState={profileState} errors={attempted ? errors : {}} />
      <PaymentSection program={program} detailsComplete={detailsComplete} validateDetails={validateDetails} />
    </>
  );
}
