"use client";

import { isCardExpiryPast } from "./card-expiry";
import { useState } from "react";
import PaymentContactDialog from "./payment-contact-dialog";
import type { Program } from "../../components/home/categories/programs";
import ProgramSection from "../../programs/components/program-section";

const fieldClass = "mt-2 w-full rounded-xl border border-brand-200 bg-white px-4 py-3 text-base text-brand-700 placeholder:text-neutral-400";

export default function PaymentSection({ program }: { program: Program }) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [expiryError, setExpiryError] = useState(false);
  const [contact, setContact] = useState<{ name: string; email: string } | null>(null);

  function openContact() {
    if (isCardExpiryPast(expiry)) {
      setExpiryError(true);
      document.getElementById("payment-card-expiry")?.focus();
      return;
    }
    const name = document.getElementById("payment-name");
    const email = document.getElementById("payment-email");
    if (!(name instanceof HTMLInputElement) || !(email instanceof HTMLInputElement)) return;
    // The contact belongs to the applicant, who may differ from the cardholder.
    for (const field of [email, name]) {
      if (!field.reportValidity()) { field.focus(); return; }
    }
    setContact({ name: name.value.trim(), email: email.value.trim() });
  }
  return (
    <ProgramSection
      id="payment"
      label="Оплата"
      title="Стоимость и оформление"
      fade="violet"
      fadeDirection="down"
      aside={
        <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm sm:p-10">
          <p className="text-sm font-semibold tracking-widest text-brand-500">ПРОГРАММА {program.tier}</p>
          <dl className="mt-7">
            <dt className="text-base text-neutral-500">Стоимость программы</dt>
            <dd className="mt-3 text-4xl font-semibold text-brand-500 sm:text-5xl">{program.price === null ? "Индивидуально" : `$${program.price}`}</dd>
          </dl>
          <p className="mt-5 text-base leading-relaxed text-neutral-600">
            {program.price === null ? "Стоимость VIP согласовывается индивидуально." : "Единоразовая оплата в долларах США."}
          </p>
          <p className="mt-5 border-t border-brand-100 pt-5 text-base leading-relaxed text-neutral-600">{program.supportSummary}</p>
        </div>
      }
    >
      <p id="payment-preview-note" className="mt-7 max-w-xl text-lg leading-relaxed text-neutral-600">Используйте только тестовые данные.</p>
      <div className="payment-form mt-10">
        <fieldset aria-describedby="payment-preview-note">
          <legend className="text-base font-medium">Способ оплаты</legend>
          <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-brand-300 bg-white px-4 py-3">
            <span className="font-medium">Банковская карта</span>
            <span className="text-sm font-semibold text-neutral-500">Visa · Mastercard</span>
          </div>
          <div className="mt-7 grid gap-6 sm:grid-cols-2">
            <label htmlFor="payment-cardholder" className="block text-sm font-medium sm:col-span-2">
              Имя владельца карты
              <input id="payment-cardholder" type="text" autoComplete="off" maxLength={200} placeholder="Как указано на карте, латиницей" className={fieldClass} />
            </label>
            <label htmlFor="payment-card-number" className="block text-sm font-medium sm:col-span-2">
              Номер карты
              <input id="payment-card-number" type="text" inputMode="numeric" autoComplete="off" maxLength={31} value={cardNumber} onChange={(event) => {
                const digits = event.target.value.replace(/\D/g, "").slice(0, 19);
                setCardNumber(digits.replace(/(.{4})(?=.)/g, "$1   "));
              }} placeholder="0000   0000   0000   0000" className={`${fieldClass} tabular-nums`} />
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
              }} onBlur={() => setExpiryError(isCardExpiryPast(expiry))} aria-invalid={expiryError} aria-describedby={expiryError ? "payment-expiry-error" : undefined} aria-label="Срок действия карты: месяц и год" className="w-full rounded-xl border border-brand-200 aria-invalid:border-red-500 bg-white px-4 py-3 font-sans text-base font-semibold tabular-nums tracking-wide text-brand-700 focus:border-brand-500" />
              </span>
              {expiryError && <span id="payment-expiry-error" role="alert" className="mt-2 block text-sm font-normal text-red-700">Срок действия карты истёк. Проверьте дату или используйте другую карту.</span>}
            </label>
            <label htmlFor="payment-card-cvc" className="block text-sm font-medium">
              CVC / CVV
              <input id="payment-card-cvc" type="password" inputMode="numeric" autoComplete="off" maxLength={4} placeholder="•••" className={fieldClass} />
            </label>
          </div>
        </fieldset>
        <button type="button" onClick={openContact} className="mt-7 inline-flex min-h-16 w-fit items-center justify-center rounded-2xl bg-brand-500 px-10 py-4 text-lg font-semibold text-white hover:bg-brand-600">{program.price === null ? "Уточнить стоимость" : `Оплатить $${program.price}`}</button>
        <p className="mt-4 text-sm leading-relaxed text-neutral-500">Данные карты не отправляются и не сохраняются. Списаний не будет.</p>
      </div>
      {contact && <PaymentContactDialog tier={program.tier} initialName={contact.name} initialEmail={contact.email} onClose={() => setContact(null)} />}
    </ProgramSection>
  );
}
