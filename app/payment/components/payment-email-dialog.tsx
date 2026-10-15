import { useEffect, useRef, useState } from "react";
import type usePaymentProfile from "./use-payment-profile";

type Props = ReturnType<typeof usePaymentProfile>["verification"];

export default function PaymentEmailDialog({ email, busy, error, ready, sendCode, verify, closeDialog, changeVerificationEmail }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);
  const [code, setCode] = useState("");
  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState(email);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingEmail) emailRef.current?.focus();
  }, [editingEmail]);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    dialog?.showModal();
    codeRef.current?.focus();
    return () => {
      dialog?.close();
      if (previousFocus instanceof HTMLElement) previousFocus.focus({ preventScroll: true });
    };
  }, []);

  return (
    <dialog ref={dialogRef} aria-labelledby="payment-verification-title" aria-describedby="payment-verification-description" onCancel={(event) => { event.preventDefault(); closeDialog(); }} className="payment-form fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-3xl border border-brand-100 bg-white p-6 text-brand-700 shadow-2xl backdrop:bg-brand-950/50 sm:p-10">
      <h2 id="payment-verification-title" className="text-2xl font-semibold">Подтвердите ваш email</h2>
      <p id="payment-verification-description" className="mt-7 text-base leading-relaxed">Чтобы загрузить сохранённую анкету, введите код из письма на <strong className="break-all">{email}</strong>. Код действителен 10 минут.</p>
      {editingEmail && <form onSubmit={(event) => {
        event.preventDefault();
        setCode("");
        setEditingEmail(false);
        changeVerificationEmail(newEmail);
      }} className="mt-7">
        <label htmlFor="payment-corrected-email" className="block text-sm font-medium">Введите ваш емайл</label>
        <input ref={emailRef} id="payment-corrected-email" type="email" autoComplete="email" required maxLength={254} value={newEmail} onChange={(event) => setNewEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-brand-200 px-4 py-3 text-base focus:border-brand-500 focus:-outline-offset-2 focus:outline-brand-500" />
        <button type="submit" disabled={busy} className="mt-4 min-h-12 rounded-xl bg-brand-500 px-5 py-3 text-base font-medium text-white hover:bg-brand-600 disabled:opacity-50">Отправить код на этот email</button>
      </form>}
      <form hidden={editingEmail} onSubmit={(event) => { event.preventDefault(); void verify(code); }} className="mt-7">
        <label htmlFor="payment-verification-code" className="block text-sm font-medium">Код из письма</label>
        <input ref={codeRef} id="payment-verification-code" name="code" inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} required pattern="[0-9]{6}" maxLength={6} aria-invalid={Boolean(error)} aria-describedby={error ? "payment-verification-error" : undefined} className="mt-2 w-full rounded-xl border border-brand-200 px-4 py-3 text-base tracking-widest focus:border-brand-500 focus:-outline-offset-2 focus:outline-brand-500" />
        {busy && <p role="status" className="mt-4 text-sm text-neutral-500">{ready ? "Проверяем код…" : "Отправляем код…"}</p>}
        {error && <p id="payment-verification-error" role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={busy || !ready || code.length !== 6} className="mt-7 min-h-12 w-full rounded-xl bg-brand-500 px-5 py-3 text-base font-medium text-white hover:bg-brand-600 disabled:opacity-50">Подтвердить и загрузить данные</button>
      </form>
      <p className="mt-5 text-sm leading-relaxed text-neutral-500">Не пришло письмо? Проверьте папку «Спам» и правильность адреса. Новый код можно запросить через минуту.</p>
      <button type="button" disabled={busy || editingEmail} onClick={() => { setCode(""); void sendCode(); }} className="mt-5 text-sm text-brand-600 underline underline-offset-4 disabled:opacity-50">{!ready && error ? "Повторить отправку кода" : "Отправить код повторно"}</button>
      <button type="button" disabled={busy} onClick={() => { setNewEmail(email); setEditingEmail(!editingEmail); }} className="mt-5 block text-sm text-brand-600 underline underline-offset-4 disabled:opacity-50">{editingEmail ? "Вернуться к вводу кода" : "Изменить email"}</button>
      <button type="button" onClick={closeDialog} className="mt-5 block text-sm text-neutral-600 underline underline-offset-4">Закрыть и заполнить вручную</button>
    </dialog>
  );
}
