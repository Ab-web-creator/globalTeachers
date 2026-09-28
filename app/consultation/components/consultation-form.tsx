"use client";

import { useRef, useState, type FormEvent } from "react";
import FormFields, { emptyAnswers, type Answers } from "./form-fields";
import EmailPending from "./email-pending";
import StepIndicator from "./step-indicator";

import { consultationSteps } from "./consultation-steps";

export default function ConsultationForm() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(emptyAnswers);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const submitting = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const panel = useRef<HTMLElement>(null);

  function resetScroll() {
    const element = panel.current;
    const main = element?.closest("main");
    if (!element || !main) return;
    element.scrollTo({ top: 0, behavior: "instant" });
    if (getComputedStyle(main).overflowY !== "hidden") {
      main.scrollTo({
        top: main.scrollTop + element.getBoundingClientRect().top - main.getBoundingClientRect().top - 16,
        behavior: "instant",
      });
    }
  }

  function changeStep(next: number) {
    setStep(next);
    setError("");
    requestAnimationFrame(() => {
      resetScroll();
      heading.current?.focus({ preventScroll: true });
    });
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < consultationSteps.length - 1) return changeStep(step + 1);
    if (submitting.current) return;
    submitting.current = true;
    setSending(true);
    setError("");
    try {
      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Не удалось отправить письмо.");
      setSent(true);
      requestAnimationFrame(resetScroll);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Проверьте соединение и попробуйте ещё раз.");
    } finally {
      submitting.current = false;
      setSending(false);
    }
  }

  return (
    <section ref={panel} className="consultation-form flex min-w-0 flex-col bg-white px-4 py-5 lg:rounded-3xl lg:border lg:border-white lg:bg-white/95 lg:p-8 lg:shadow-xl lg:shadow-slate-900/5 lg:h-full lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain xl:p-10" aria-labelledby="form-heading">
      {sent ? <EmailPending email={answers.email} onEdit={() => { setSent(false); changeStep(0); }} /> : <>
      <StepIndicator step={step} />
      <h2 ref={heading} tabIndex={-1} id="form-heading" className="mt-5 text-2xl font-semibold tracking-tight outline-none sm:mt-8">{consultationSteps[step].title}</h2>
      {consultationSteps[step].description && <p className="mt-2 mb-4 text-sm leading-relaxed text-neutral-500 sm:mb-6">{consultationSteps[step].description}</p>}
      <form onSubmit={submit} className="flex flex-1 flex-col">
        <fieldset disabled={sending} className="flex min-w-0 flex-1 flex-col">
        <FormFields step={step} answers={answers} onChange={(name, value) => { setError(""); setAnswers((previous) => ({ ...previous, [name]: value })); }} />
        {step === consultationSteps.length - 1 && <p className="mt-4 text-xs leading-relaxed text-neutral-500">Мы отправим вам письмо со ссылкой для подтверждения email. Перейдите по ней, чтобы завершить отправку заявки.</p>}
        {step !== 1 && step !== 2 && step !== 5 && <p className="mt-5 text-xs leading-relaxed text-neutral-500">◇ Ваши данные используются только для рассмотрения заявки и связи с вами.</p>}
        {error && <p role="alert" className="mt-5 text-sm text-red-700">{error}</p>}
        <div className="mt-6 flex shrink-0 gap-3">
          {step > 0 && <button type="button" onClick={() => changeStep(step - 1)} className="rounded-xl border border-brand-200 px-4 py-3 text-sm hover:bg-brand-50">Назад <span aria-hidden="true">←</span></button>}
          <button type="submit" className="action-gradient flex min-h-12 flex-1 items-center justify-center gap-3 rounded-xl px-4 py-3 font-medium text-white focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-brand-500">{sending ? "Отправляем…" : step < consultationSteps.length - 1 ? "Далее" : "Отправить заявку"}<span aria-hidden="true">→</span></button>
        </div>
        </fieldset>
      </form>
      </>}
      {sent && <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-neutral-500"><span aria-hidden="true">◇</span>Ваши данные используются только для рассмотрения заявки и связи с вами.</p>}
    </section>
  );
}
