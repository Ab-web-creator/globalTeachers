"use client";

import { useRef, useState, type FormEvent } from "react";
import FormFields, { emptyAnswers, type Answers } from "./form-fields";
import EmailPending from "./email-pending";
import StepIndicator from "./step-indicator";
import FormNavigation from "./form-navigation";
import NameFields, { type TeacherName } from "./name-fields";

import { consultationSteps } from "./consultation-steps";
import styles from "./consultation-form.module.css";

export default function ConsultationForm() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(emptyAnswers);
  const [teacherName, setTeacherName] = useState<TeacherName>({ firstName: "", lastName: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const submitting = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const scrollArea = useRef<HTMLDivElement>(null);

  function resetScroll() {
    scrollArea.current?.scrollTo({ top: 0, behavior: "instant" });
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
    if (consultationSteps[step].fields[0] === "subject" && !answers.subject) {
      setError("Выберите хотя бы один предмет.");
      return;
    }
    if (step < consultationSteps.length - 1) return changeStep(step + 1);
    if (submitting.current) return;
    submitting.current = true;
    setSending(true);
    setError("");
    try {
      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...answers, name: `${teacherName.firstName.trim()} ${teacherName.lastName.trim()}` }),
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
    <section className="consultation-form flex h-full min-h-0 min-w-0 flex-col overflow-hidden bg-white px-4 py-5 lg:rounded-3xl lg:border lg:border-white lg:bg-white/95 lg:p-8 lg:shadow-xl lg:shadow-slate-900/5 xl:p-10" aria-labelledby="form-heading">
      {sent ? <div className="min-h-0 overflow-y-auto overscroll-contain">
        <EmailPending email={answers.email} onEdit={() => { setSent(false); changeStep(0); }} />
        <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-neutral-500"><span aria-hidden="true">◇</span>Ваши данные используются только для рассмотрения заявки и связи с вами.</p>
      </div> : <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
        <fieldset disabled={sending} className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div ref={scrollArea} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <div className={`${["name", "goals"].includes(consultationSteps[step].fields[0]) ? "grid-rows-[auto_1fr]" : styles.stepLayout} grid h-full content-start`}>
              <div className={consultationSteps[step].fields[0] === "goals" ? "pb-4" : "pb-6"}>
                <StepIndicator step={step} />
                <h2 ref={heading} tabIndex={-1} id="form-heading" className="mt-5 text-2xl font-semibold tracking-tight outline-none sm:mt-8">{consultationSteps[step].title}</h2>
                {consultationSteps[step].description && <p id="step-description" className="mt-2 text-sm leading-relaxed text-neutral-500">{consultationSteps[step].description}</p>}
              </div>
              <div className="flex min-w-0 flex-col gap-6 pb-1">
                <div>
                  {consultationSteps[step].fields[0] === "name"
                    ? <NameFields value={teacherName} onChange={(value) => { setError(""); setTeacherName(value); }} />
                    : <FormFields step={step} answers={answers} onChange={(name, value) => { setError(""); setAnswers((previous) => ({ ...previous, [name]: value })); }} />}
                  {error && <p role="alert" className="mt-2 px-4 text-sm text-red-700">{error}</p>}
                </div>
                <div className="mt-auto">
                  {step === consultationSteps.length - 1 && <p className="mt-4 text-xs leading-relaxed text-neutral-500">Мы отправим вам письмо со ссылкой для подтверждения email. Перейдите по ней, чтобы завершить отправку заявки.</p>}
                </div>
              </div>
            </div>
          </div>
          <FormNavigation step={step} sending={sending} onBack={() => changeStep(step - 1)} />
        </fieldset>
      </form>}
    </section>
  );
}
