"use client";

import { isCardExpiryPast } from "./card-expiry";
import Link from "next/link";
import { useState } from "react";
import PaymentContactDialog from "./payment-contact-dialog";
import type { Program } from "../../components/home/categories/programs";
import ProgramSection from "../../programs/components/program-section";

const fieldClass = "mt-2 w-full rounded-xl border border-brand-200 bg-white px-4 py-3 text-base text-brand-700 placeholder:text-neutral-400 aria-invalid:border-red-500";

export default function PaymentSection({ program, detailsComplete, validateDetails }: { program: Program; detailsComplete: boolean; validateDetails: () => string | null }) {
  const paymentAmount = program.tier === "VIP" ? 99 : program.price;
  const [cardholder, setCardholder] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [expiryError, setExpiryError] = useState(false);
  const [contact, setContact] = useState<{ name: string; email: string } | null>(null);
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
    const name = document.getElementById("payment-name");
    const email = document.getElementById("payment-email");
    if (!canContinue || !(name instanceof HTMLInputElement) || !(email instanceof HTMLInputElement)) return;
    setContact({ name: name.value.trim(), email: email.value.trim() });
  }

  return (
    <ProgramSection
      id="payment"
      label="Оплата"
      title="Стоимость и оформление"
      fade="violet"
      fadeDirection="down"
      asideClassName="hidden sm:block lg:justify-self-end lg:w-full lg:max-w-sm"
      aside={program.tier === "VIP" && (
        <div className="w-full max-w-sm rounded-3xl border border-brand-100 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold tracking-widest text-brand-500">ПРОГРАММА VIP</p>
          <dl className="mt-7">
            <dt className="text-base text-neutral-500">Стоимость программы</dt>
            <dd className="mt-3 text-4xl font-semibold text-brand-500">Индивидуально</dd>
          </dl>
          <p className="mt-5 text-base leading-relaxed text-neutral-600">Стоимость VIP согласовывается индивидуально.</p>
          <p className="mt-5 border-t border-brand-100 pt-5 text-base leading-relaxed text-neutral-600">{program.supportSummary}</p>
        </div>
      )}
    >
      <div className="payment-form mt-10 max-w-2xl">
        <fieldset>
          <legend className="text-base font-medium">Способ оплаты</legend>
          <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-brand-300 bg-white px-4 py-3">
            <span className="font-medium">Банковская карта</span>
            <span className="text-sm font-semibold text-neutral-500">Visa · Mastercard</span>
          </div>
          <div className="mt-7 grid gap-6 sm:grid-cols-2">
            <label htmlFor="payment-cardholder" className="block text-sm font-medium sm:col-span-2">
              Имя владельца карты
              <input id="payment-cardholder" aria-invalid={Boolean(visibleErrors["payment-cardholder"])} aria-describedby={visibleErrors["payment-cardholder"] ? "payment-cardholder-error" : undefined} value={cardholder} onChange={(event) => setCardholder(event.target.value)} type="text" autoComplete="off" maxLength={200} placeholder="Как указано на карте, латиницей" className={fieldClass} />
              {visibleErrors["payment-cardholder"] && <span id="payment-cardholder-error" className="mt-2 block text-sm font-normal text-red-700">{visibleErrors["payment-cardholder"]}</span>}
            </label>
            <label htmlFor="payment-card-number" className="block text-sm font-medium sm:col-span-2">
              Номер карты
              <input id="payment-card-number" aria-invalid={Boolean(visibleErrors["payment-card-number"])} aria-describedby={visibleErrors["payment-card-number"] ? "payment-card-number-error" : undefined} type="text" inputMode="numeric" autoComplete="off" maxLength={31} value={cardNumber} onChange={(event) => {
                const digits = event.target.value.replace(/\D/g, "").slice(0, 19);
                setCardNumber(digits.replace(/(.{4})(?=.)/g, "$1   "));
              }} placeholder="0000   0000   0000   0000" className={`${fieldClass} tabular-nums`} />
              {visibleErrors["payment-card-number"] && <span id="payment-card-number-error" className="mt-2 block text-sm font-normal text-red-700">{visibleErrors["payment-card-number"]}</span>}
            </label>
            <label htmlFor="payment-card-expiry" className="block text-sm font-medium">
              Срок действия
              <span className="relative mt-2 block">
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 px-4 py-3 font-sans text-base font-semibold tabular-nums tracking-wide text-neutral-400"><span className="invisible">{expiry}</span>{"ММ / ГГ".slice(expiry.length)}</span>
              <input id="payment-card-expiry" type="text" inputMode="numeric" autoComplete="off" value={expiry} onChange={(event) => {
                const digits = event.target.value.replace(/\D/g, "").slice(0, 4);
                if (digits.length >= 2 && (Number(digits.slice(0, 2)) < 1 || Number(digits.slice(0, 2)) > 12)) return;
                setExpiryError(isCardExpiryPast(digits));
                const deleting = (event.nativeEvent as InputEvent).inputType?.startsWith("delete");
                setExpiry(digits.length > 2 || (digits.length === 2 && !deleting) ? `${digits.slice(0, 2)} / ${digits.slice(2)}` : digits);
              }} onBlur={() => setExpiryError(isCardExpiryPast(expiry))} aria-invalid={expiryError || Boolean(visibleErrors["payment-card-expiry"])} aria-describedby={expiryError || visibleErrors["payment-card-expiry"] ? "payment-expiry-error" : undefined} aria-label="Срок действия карты: месяц и год" className="w-full rounded-xl border border-brand-200 aria-invalid:border-red-500 bg-white px-4 py-3 font-sans text-base font-semibold tabular-nums tracking-wide text-brand-700 focus:border-brand-500" />
              </span>
              {(expiryError || visibleErrors["payment-card-expiry"]) && <span id="payment-expiry-error" role="alert" className="mt-2 block text-sm font-normal text-red-700">{visibleErrors["payment-card-expiry"] ?? "Срок действия карты истёк. Проверьте дату или используйте другую карту."}</span>}
            </label>
            <label htmlFor="payment-card-cvc" className="block text-sm font-medium">
              CVC / CVV
              <input id="payment-card-cvc" aria-invalid={Boolean(visibleErrors["payment-card-cvc"])} aria-describedby={visibleErrors["payment-card-cvc"] ? "payment-card-cvc-error" : undefined} value={cvc} onChange={(event) => setCvc(event.target.value.replace(/\D/g, "").slice(0, 4))} type="password" inputMode="numeric" autoComplete="off" maxLength={4} placeholder="•••" className={fieldClass} />
              {visibleErrors["payment-card-cvc"] && <span id="payment-card-cvc-error" className="mt-2 block text-sm font-normal text-red-700">{visibleErrors["payment-card-cvc"]}</span>}
            </label>
          </div>
        </fieldset>
        <label htmlFor="payment-terms" className="mt-7 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-neutral-700">
          <input id="payment-terms" type="checkbox" checked={agreed} onChange={(event) => { setAgreed(event.target.checked); }} aria-invalid={Boolean(visibleErrors["payment-terms"])} aria-describedby={visibleErrors["payment-terms"] ? "payment-terms-error" : undefined} className="peer sr-only" />
          <span aria-hidden="true" className="flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-neutral-300 peer-checked:border-brand-500 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-500 peer-aria-invalid:border-red-500 peer-checked:[&>span]:scale-100">
            <span className="size-2.5 scale-0 rounded-full bg-brand-500 transition-transform" />
          </span>
          <span>
            Я ознакомился с составом пакета, <Link href="/refund-policy" target="_blank" className="text-brand-600 underline underline-offset-4 hover:text-brand-700">условиями оказания услуг и политикой возврата средств</Link>.
          </span>
        </label>
        {visibleErrors["payment-terms"] && <p id="payment-terms-error" role="alert" className="mt-2 text-sm text-red-700">Подтвердите, что вы ознакомились с условиями.</p>}
        <button type="button" aria-disabled={!canContinue} onClick={openContact} className="mt-7 inline-flex min-h-16 w-fit items-center justify-center rounded-2xl bg-brand-500 px-10 py-4 text-lg font-semibold text-white hover:bg-brand-600 aria-disabled:cursor-not-allowed aria-disabled:bg-neutral-200 aria-disabled:text-neutral-500 aria-disabled:shadow-none">{`Оплатить $${paymentAmount}`}</button>
        <p className="mt-4 text-sm leading-relaxed text-neutral-500">Платёж обрабатывается через защищённый платёжный сервис. Данные карты не сохраняются на наших серверах.</p>
      </div>
      {contact && <PaymentContactDialog tier={program.tier} initialName={contact.name} initialEmail={contact.email} onClose={() => setContact(null)} />}
    </ProgramSection>
  );
}
