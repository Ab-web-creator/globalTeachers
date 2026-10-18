import { useEffect, useRef, useState } from "react";

type Props = { tier: string; initialFirstName: string; initialLastName: string; initialEmail: string; onClose: () => void };
const fieldClass = "mt-2 w-full rounded-xl border border-brand-200 bg-white px-4 py-3 text-base focus:border-brand-500";

export default function PaymentContactDialog({ tier, initialFirstName, initialLastName, initialEmail, onClose }: Props) {
  const paymentSubject = tier === "VIP" ? "индивидуальную консультацию по VIP-сопровождению" : `программу ${tier}`;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const requestIdRef = useRef("");
  const payloadRef = useRef("");
  const requestRef = useRef<AbortController | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    const previous = document.activeElement;
    dialog?.showModal();
    const timer = window.setTimeout(() => setLoading(false), 3000);
    return () => {
      window.clearTimeout(timer);
      requestRef.current?.abort();
      dialog?.close();
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, []);

  useEffect(() => {
    if (!loading) messageRef.current?.focus({ preventScroll: true });
  }, [loading]);

  async function submit(form: HTMLFormElement) {
    if (sending) return;
    const fields = new FormData(form);
    const payload = { tier, firstName: String(fields.get("firstName")).trim(), lastName: String(fields.get("lastName")).trim(), email: String(fields.get("email")).trim(), message: String(fields.get("message")).trim() };
    const serialized = JSON.stringify(payload);
    if (serialized !== payloadRef.current) {
      requestIdRef.current = crypto.randomUUID();
      payloadRef.current = serialized;
    }
    setSending(true);
    setError("");
    const controller = new AbortController();
    requestRef.current = controller;
    try {
      const response = await fetch("/api/payment/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, id: requestIdRef.current }), signal: controller.signal });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setSent(true);
    } catch (cause) {
      if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "Не удалось отправить сообщение.");
    } finally { if (!controller.signal.aborted) setSending(false); }
  }

  return (
    <dialog ref={dialogRef} onCancel={(event) => { event.preventDefault(); onClose(); }} aria-busy={loading} aria-label={loading ? "Загрузка" : undefined} aria-labelledby={loading ? undefined : "payment-contact-title"} className="payment-form fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-3xl border border-brand-100 bg-white p-6 text-brand-700 shadow-2xl backdrop:bg-brand-950/50 sm:p-10">
      {loading && (
        <div role="status" className="absolute inset-0 flex items-center justify-center">
          <span aria-hidden="true" className="size-12 animate-spin rounded-full border-4 border-brand-100 border-t-brand-500 motion-reduce:animate-none" />
          <span className="sr-only">Загрузка…</span>
        </div>
      )}
      <div inert={loading} aria-hidden={loading} className={loading ? "invisible" : undefined}>
        <h2 id="payment-contact-title" className="text-2xl font-semibold">{sent ? "Сообщение отправлено" : "Онлайн-оплата пока недоступна"}</h2>
        {sent ? <p role="status" className="mt-7 text-base leading-relaxed">Спасибо! Мы свяжемся с вами по email и подскажем, как оплатить {paymentSubject}. Списаний не было.</p> : <>
          <p className="mt-7 text-base leading-relaxed">Свяжитесь с нами, чтобы узнать о других способах оплаты {tier === "VIP" ? "индивидуальной консультации по VIP-сопровождению" : `программы ${tier}`}. Списаний не было.</p>
          <form onSubmit={(event) => { event.preventDefault(); void submit(event.currentTarget); }} className="mt-7">
            <fieldset disabled={sending} className="space-y-5">
              <label className="block text-sm font-medium">Ваше имя<input name="firstName" defaultValue={initialFirstName} autoComplete="given-name" required pattern=".*\S.*" maxLength={100} className={fieldClass} /></label>
              <label className="block text-sm font-medium">Ваша фамилия<input name="lastName" defaultValue={initialLastName} autoComplete="family-name" required pattern=".*\S.*" maxLength={100} className={fieldClass} /></label>
              <label className="block text-sm font-medium">Email<input name="email" type="email" defaultValue={initialEmail} autoComplete="email" required maxLength={254} className={fieldClass} /></label>
              <label className="block text-sm font-medium">Сообщение<textarea ref={messageRef} name="message" required maxLength={2000} rows={4} placeholder={`Здравствуйте! Хочу оплатить ${paymentSubject}. Подскажите, пожалуйста, какие способы оплаты доступны.`} className={`${fieldClass} resize-y placeholder:font-normal placeholder:text-neutral-400`} /></label>
              {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
              <button type="submit" className="min-h-12 w-fit max-w-full rounded-xl bg-brand-500 px-8 py-3 text-base font-medium text-white hover:bg-brand-600 disabled:opacity-50">{sending ? "Отправляем…" : "Отправить сообщение"}</button>
            </fieldset>
          </form>
        </>}
        <button type="button" onClick={onClose} className="mt-5 text-sm text-neutral-600 underline underline-offset-4">Закрыть</button>
      </div>
    </dialog>
  );
}
