"use client";

import { useRef, useState, type FormEvent } from "react";
import FormFields, { emptyAnswers, type Answers } from "./form-fields";
import EmailPending from "./email-pending";
import StepIndicator from "./step-indicator";

const headings = ["О вас", "Ваш опыт", "Ваши планы"];
const descriptions = ["Познакомимся, чтобы лучше понять вашу ситуацию.", "Помогите нам понять вашу специализацию и подготовку.", "Расскажите о планах и вопросах для консультации."];

export default function ConsultationForm() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(emptyAnswers);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const submitting = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const panel = useRef<HTMLElement>(null);

  function changeStep(next: number) {
    setStep(next);
    setError("");
    requestAnimationFrame(() => {
      panel.current?.scrollTo({ top: 0, behavior: "instant" });
      heading.current?.focus({ preventScroll: true });
    });
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < 2) return changeStep(step + 1);
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
      panel.current?.scrollTo({ top: 0, behavior: "instant" });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Проверьте соединение и попробуйте ещё раз.");
    } finally {
      submitting.current = false;
      setSending(false);
    }
  }

  return (
    <section ref={panel} className="h-[calc(100dvh-7.5rem)] min-h-0 overflow-y-auto overscroll-contain rounded-3xl border border-white bg-white/95 p-6 shadow-xl shadow-slate-900/5 sm:h-[calc(100dvh-9.5rem)] sm:p-8 lg:h-full xl:p-10" aria-labelledby="form-heading">
      {sent ? <EmailPending email={answers.email} onEdit={() => { setSent(false); changeStep(0); }} /> : <>
      <StepIndicator step={step} />
      <h2 ref={heading} tabIndex={-1} id="form-heading" className="mt-8 text-2xl font-semibold tracking-tight outline-none">{headings[step]}</h2>
      <p className="mt-2 mb-6 text-sm leading-relaxed text-neutral-500">{descriptions[step]}</p>
      <form onSubmit={submit}>
        <fieldset disabled={sending}>
        <FormFields step={step} answers={answers} onChange={(name, value) => { setError(""); setAnswers((previous) => ({ ...previous, [name]: value })); }} />
        {step === 2 && <p className="mt-4 text-xs leading-relaxed text-neutral-500">Мы отправим вам письмо со ссылкой для подтверждения email. Перейдите по ней, чтобы завершить отправку заявки.</p>}
        <div className="mt-6 flex gap-3">
          {step > 0 && <button type="button" onClick={() => changeStep(step - 1)} className="rounded-xl border border-brand-200 px-4 py-3 text-sm hover:bg-brand-50">Назад <span aria-hidden="true">←</span></button>}
          <button type="submit" className="action-gradient flex min-h-12 flex-1 items-center justify-center gap-3 rounded-xl px-4 py-3 font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500">{sending ? "Отправляем…" : step < 2 ? "Далее" : "Отправить заявку"}<span aria-hidden="true">→</span></button>
        </div>
        </fieldset>
      </form>
      {error && <p role="alert" className="mt-5 text-sm text-red-700">{error}</p>}
      </>}
      <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-neutral-500"><span aria-hidden="true">◇</span>Ваши данные используются только для рассмотрения заявки и связи с вами.</p>
    </section>
  );
}
