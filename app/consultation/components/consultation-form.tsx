"use client";

import { useRef, useState, type FormEvent } from "react";
import FormFields, { emptyAnswers, type Answers } from "./form-fields";
import EmailPending from "./email-pending";
import StepIndicator from "./step-indicator";
import FormNavigation from "./form-navigation";
import NameFields, { type TeacherName } from "./name-fields";

import { consultationSteps } from "./consultation-steps";
import { validateStep } from "./validate-step";

export default function ConsultationForm() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(emptyAnswers);
  const [teacherName, setTeacherName] = useState<TeacherName>({ firstName: "", lastName: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [errorField, setErrorField] = useState("");
  const submitting = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const scrollArea = useRef<HTMLDivElement>(null);
  const errorMessage = useRef<HTMLParagraphElement>(null);
  const isEnglishStep = consultationSteps[step].fields[0] === "english";

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
    const validationError = validateStep(event.currentTarget, consultationSteps[step].fields[0], answers);
    if (validationError) {
      setError(validationError.message);
      setErrorField(validationError.field);
      requestAnimationFrame(() => errorMessage.current?.scrollIntoView({ block: "nearest" }));
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
      if (!response.ok && result.field) {
        const invalidStep = consultationSteps.findIndex((item) => item.fields[0] === result.field);
        if (invalidStep >= 0) {
          changeStep(invalidStep);
          setErrorField(result.field === "name" ? "firstName" : result.field);
          setError(result.error);
          return;
        }
      }
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
    <section className="consultation-form flex h-full min-h-0 min-w-0 flex-col overflow-hidden bg-white lg:rounded-3xl lg:shadow-surround lg:shadow-brand-950/8" aria-labelledby="form-heading">
      {sent ? <div className="min-h-0 overflow-y-auto overscroll-contain px-4 py-5 lg:p-8 xl:p-10">
        <EmailPending email={answers.email} onEdit={() => { setSent(false); changeStep(0); }} />
        <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-neutral-500"><span aria-hidden="true">◇</span>Ваши данные используются только для рассмотрения заявки и связи с вами.</p>
      </div> : <form noValidate onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
        <fieldset disabled={sending} aria-describedby={error ? "step-error" : undefined} className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div ref={scrollArea} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <div className="flex min-h-full flex-col">
              <div className={`bg-white px-4 lg:px-8 xl:px-10 ${isEnglishStep ? "pt-5 pb-4 lg:pt-8 xl:pt-10" : "py-5 lg:py-8 xl:py-10"}`}>
                <StepIndicator step={step} />
                <h2 ref={heading} tabIndex={-1} id="form-heading" className="mt-5 text-2xl font-semibold tracking-tight outline-none sm:mt-8">{consultationSteps[step].title}</h2>
                {consultationSteps[step].description && <p id="step-description" className="mt-2 text-sm leading-relaxed text-neutral-500">{consultationSteps[step].description}</p>}
              </div>
              <div className={`flex min-w-0 flex-1 flex-col gap-6 bg-white px-4 lg:px-8 xl:px-10 ${isEnglishStep ? "pt-5.25 pb-6 lg:pb-8 xl:pb-10" : "py-6 lg:py-8 xl:py-10"}`}>
                <div>
                  {consultationSteps[step].fields[0] === "name"
                    ? <NameFields value={teacherName} error={error} errorField={errorField} errorRef={errorMessage} onChange={(value) => { setError(""); setTeacherName(value); }} />
                    : <FormFields step={step} answers={answers} onChange={(name, value) => { setError(""); setAnswers((previous) => ({ ...previous, [name]: value })); }} />}
                  {error && consultationSteps[step].fields[0] !== "name" && <p ref={errorMessage} id="step-error" role="alert" className={`mt-2 text-sm text-red-700 ${["country", "email", "subject", "goals"].includes(consultationSteps[step].fields[0]) ? "px-4" : ""}`}>{error}</p>}
                </div>
                <div className="mt-auto">
                  {step === consultationSteps.length - 1 && <p className="mt-4 text-xs leading-relaxed text-neutral-500">Мы отправим вам письмо со ссылкой для подтверждения email. Перейдите по ней, чтобы завершить отправку заявки.</p>}
                </div>
              </div>
            </div>
          </div>
          <div className="shrink-0 bg-white px-4 pb-5 lg:px-8 lg:pb-8 xl:px-10 xl:pb-10">
            <FormNavigation step={step} sending={sending} onBack={() => changeStep(step - 1)} />
          </div>
        </fieldset>
      </form>}
    </section>
  );
}
