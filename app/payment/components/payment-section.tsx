"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import { isCardExpiryPast } from "./card-expiry";
import Link from "next/link";
import { useState } from "react";
import PaymentContactDialog from "./payment-contact-dialog";
import type { Program } from "../../components/home/categories/programs";
import ProgramSection from "../../programs/components/program-section";

const fieldClass = "mt-2 w-full rounded-xl border border-brand-200 bg-white px-4 py-3 text-base text-brand-700 placeholder:text-neutral-400 aria-invalid:border-red-500";

export default function PaymentSection({ program, detailsComplete, validateDetails }: { program: Program; detailsComplete: boolean; validateDetails: () => string | null }) {
  const t = useTranslations();
  const paymentAmount = program.tier === "VIP" ? 99 : program.price;
  const [cardholder, setCardholder] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [expiryError, setExpiryError] = useState(false);
  const [contact, setContact] = useState<{ firstName: string; lastName: string; email: string } | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [attempted, setAttempted] = useState(false);

  const expiryDigits = expiry.replace(/\D/g, "");
  const errors: Record<string, string> = {};
  if (!cardholder.trim()) errors["payment-cardholder"] = "Укажите имя владельца карты.";
  if (cardNumber.replace(/\D/g, "").length < 13) errors["payment-card-number"] = "Введите полный номер карты.";
  if (expiryDigits.length !== 4 || Number(expiryDigits.slice(0, 2)) < 1 || Number(expiryDigits.slice(0, 2)) > 12 || isCardExpiryPast(expiry)) {
    errors["payment-card-expiry"] = "Укажите действующий срок карты в формате ММ / ГГ.";
  }
  if (!/^\d{3,4}$/.test(cvc)) errors["payment-card-cvc"] = "Введите CVC / CVV: 3 или 4 цифры.";
  if (!agreed) errors["payment-terms"] = "Подтвердите, что вы ознакомились с условиями.";
  const canContinue = detailsComplete && Object.keys(errors).length === 0;
  const visibleErrors = attempted ? errors : {};

  function openContact() {
    setAttempted(true);
    const firstInvalid = validateDetails() ?? Object.keys(errors)[0];
    if (firstInvalid) {
      // Wait for inline errors to render before measuring the target's position.
      requestAnimationFrame(() => {
        const field = document.getElementById(firstInvalid);
        const target = field?.closest("label") ?? field;
        if (!target) return;
        const headerHeight = document.querySelector("header")?.getBoundingClientRect().height ?? 80;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 32;
        const focusTarget = field?.matches("input, select, button") ? field : field?.querySelector("button");
        if (focusTarget instanceof HTMLElement) focusTarget.focus({ preventScroll: true });
        window.scrollTo({ top: Math.max(0, top), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
      });
      return;
    }
    const firstName = document.getElementById("payment-first-name");
    const lastName = document.getElementById("payment-last-name");
    const email = document.getElementById("payment-email");
    if (!canContinue || !(firstName instanceof HTMLInputElement) || !(lastName instanceof HTMLInputElement) || !(email instanceof HTMLInputElement)) return;
    setContact({ firstName: firstName.value.trim(), lastName: lastName.value.trim(), email: email.value.trim() });
  }

  return (
    <ProgramSection
      id="payment"
      label={t("payment.paymentSection.message1076")}
      title={t("payment.paymentSection.message1077")}
      fade="violet"
      fadeDirection="down"
    >
      <div className="payment-form mt-10 max-w-2xl">
        <fieldset>
          <legend className="text-base font-medium">{t("payment.paymentSection.message1078")}</legend>
          <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-brand-300 bg-white px-4 py-3">
            <span className="font-medium">{t("payment.paymentSection.message1079")}</span>
            <span className="text-sm font-semibold text-neutral-500">Visa · Mastercard</span>
          </div>
          <div className="mt-7 grid gap-6 sm:grid-cols-2">
            <label htmlFor="payment-cardholder" className="block text-sm font-medium sm:col-span-2">
              {t("payment.paymentSection.message1080")}<input id="payment-cardholder" aria-invalid={Boolean(visibleErrors["payment-cardholder"])} aria-describedby={visibleErrors["payment-cardholder"] ? "payment-cardholder-error" : undefined} value={cardholder} onChange={(event) => setCardholder(event.target.value)} type="text" autoComplete="off" maxLength={200} placeholder={t("payment.paymentSection.message1081")} className={fieldClass} />
              {t.content(visibleErrors["payment-cardholder"] && <span id="payment-cardholder-error" className="mt-2 block text-sm font-normal text-red-700">{t.content(visibleErrors["payment-cardholder"])}</span>)}
            </label>
            <label htmlFor="payment-card-number" className="block text-sm font-medium sm:col-span-2">
              {t("payment.paymentSection.message1082")}<input id="payment-card-number" aria-invalid={Boolean(visibleErrors["payment-card-number"])} aria-describedby={visibleErrors["payment-card-number"] ? "payment-card-number-error" : undefined} type="text" inputMode="numeric" autoComplete="off" maxLength={31} value={cardNumber} onChange={(event) => {
                const digits = event.target.value.replace(/\D/g, "").slice(0, 19);
                setCardNumber(digits.replace(/(.{4})(?=.)/g, "$1   "));
              }} placeholder="0000   0000   0000   0000" className={`${fieldClass} tabular-nums`} />
              {t.content(visibleErrors["payment-card-number"] && <span id="payment-card-number-error" className="mt-2 block text-sm font-normal text-red-700">{t.content(visibleErrors["payment-card-number"])}</span>)}
            </label>
            <label htmlFor="payment-card-expiry" className="block text-sm font-medium">
              {t("payment.paymentSection.message1083")}<span className="relative mt-2 block">
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 px-4 py-3 font-sans text-base font-semibold tabular-nums tracking-wide text-neutral-400"><span className="invisible">{t.content(expiry)}</span>{t.content("ММ / ГГ".slice(expiry.length))}</span>
              <input id="payment-card-expiry" type="text" inputMode="numeric" autoComplete="off" value={expiry} onChange={(event) => {
                const digits = event.target.value.replace(/\D/g, "").slice(0, 4);
                if (digits.length >= 2 && (Number(digits.slice(0, 2)) < 1 || Number(digits.slice(0, 2)) > 12)) return;
                setExpiryError(isCardExpiryPast(digits));
                const deleting = (event.nativeEvent as InputEvent).inputType?.startsWith("delete");
                setExpiry(digits.length > 2 || (digits.length === 2 && !deleting) ? `${digits.slice(0, 2)} / ${digits.slice(2)}` : digits);
              }} onBlur={() => setExpiryError(isCardExpiryPast(expiry))} aria-invalid={expiryError || Boolean(visibleErrors["payment-card-expiry"])} aria-describedby={expiryError || visibleErrors["payment-card-expiry"] ? "payment-expiry-error" : undefined} aria-label={t("payment.paymentSection.message1085")} className="w-full rounded-xl border border-brand-200 aria-invalid:border-red-500 bg-white px-4 py-3 font-sans text-base font-semibold tabular-nums tracking-wide text-brand-700 focus:border-brand-500" />
              </span>
              {t.content((expiryError || visibleErrors["payment-card-expiry"]) && <span id="payment-expiry-error" role="alert" className="mt-2 block text-sm font-normal text-red-700">{t.content(visibleErrors["payment-card-expiry"] ?? "Срок действия карты истёк. Проверьте дату или используйте другую карту.")}</span>)}
            </label>
            <label htmlFor="payment-card-cvc" className="block text-sm font-medium">
              CVC / CVV
              <input id="payment-card-cvc" aria-invalid={Boolean(visibleErrors["payment-card-cvc"])} aria-describedby={visibleErrors["payment-card-cvc"] ? "payment-card-cvc-error" : undefined} value={cvc} onChange={(event) => setCvc(event.target.value.replace(/\D/g, "").slice(0, 4))} type="password" inputMode="numeric" autoComplete="off" maxLength={4} placeholder="•••" className={fieldClass} />
              {t.content(visibleErrors["payment-card-cvc"] && <span id="payment-card-cvc-error" className="mt-2 block text-sm font-normal text-red-700">{t.content(visibleErrors["payment-card-cvc"])}</span>)}
            </label>
          </div>
        </fieldset>
        <label htmlFor="payment-terms" className="mt-7 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-neutral-700">
          <input id="payment-terms" type="checkbox" checked={agreed} onChange={(event) => { setAgreed(event.target.checked); }} aria-invalid={Boolean(visibleErrors["payment-terms"])} aria-describedby={visibleErrors["payment-terms"] ? "payment-terms-error" : undefined} className="peer sr-only" />
          <span aria-hidden="true" className="flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-neutral-300 peer-checked:border-brand-500 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-500 peer-aria-invalid:border-red-500 peer-checked:[&>span]:scale-100">
            <span className="size-2.5 scale-0 rounded-full bg-brand-500 transition-transform" />
          </span>
          <span>
            {t("payment.paymentSection.message1087")}{" "}<Link href="/refund-policy" target="_blank" className="text-brand-600 underline underline-offset-4 hover:text-brand-700">{t("payment.paymentSection.message1088")}</Link>.
          </span>
        </label>
        {t.content(visibleErrors["payment-terms"] && <p id="payment-terms-error" role="alert" className="mt-2 text-sm text-red-700">{t("payment.paymentSection.message1075")}</p>)}
        <button type="button" aria-disabled={!canContinue} onClick={openContact} className="mt-7 inline-flex min-h-16 w-fit items-center justify-center rounded-2xl border border-transparent bg-brand-500 px-10 py-4 text-lg font-semibold text-white hover:bg-brand-600 aria-disabled:cursor-not-allowed aria-disabled:border-neutral-300 aria-disabled:bg-transparent aria-disabled:hover:bg-transparent aria-disabled:text-neutral-500 aria-disabled:shadow-none">{t.content(`Оплатить $${paymentAmount}`)}</button>
        <p className="mt-4 text-sm leading-relaxed text-neutral-500">{t("payment.paymentSection.message1090")}</p>
      </div>
      {contact && <PaymentContactDialog tier={program.tier} initialFirstName={contact.firstName} initialLastName={contact.lastName} initialEmail={contact.email} onClose={() => setContact(null)} />}
    </ProgramSection>
  );
}
