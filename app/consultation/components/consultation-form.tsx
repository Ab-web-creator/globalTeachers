"use client";

import { useRef, useState, type FormEvent } from "react";
import FormFields, { emptyAnswers, type Answers } from "./form-fields";
import StepIndicator from "./step-indicator";

const headings = ["Расскажите о себе", "Ваш педагогический опыт", "Куда хотите двигаться?"];
const descriptions = ["Познакомимся, чтобы лучше понять вашу ситуацию.", "Помогите нам понять вашу специализацию и подготовку.", "Расскажите о планах и вопросах для консультации."];
const answerLabels: Record<keyof Answers, string> = { name: "Имя", country: "Страна проживания", email: "Email", contact: "WhatsApp / Telegram", subject: "Специализация", experience: "Стаж", english: "Английский", destinations: "Интересующие страны", timing: "Сроки", goals: "Цели и вопросы" };

export default function ConsultationForm() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(emptyAnswers);
  const [prepared, setPrepared] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const message = Object.entries(answers).map(([key, value]) => `${answerLabels[key as keyof Answers]}: ${value.trim() || "Не указано"}`).join("\n");
  const mailto = `mailto:info@globalteacherhub.com?subject=${encodeURIComponent("Запрос на консультацию — " + answers.name)}&body=${encodeURIComponent(message)}`;

  function changeStep(next: number) {
    setStep(next);
    setPrepared(false);
    requestAnimationFrame(() => heading.current?.focus());
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < 2) changeStep(step + 1);
    else {
      setPrepared(true);
      window.location.href = mailto;
    }
  }

  return (
    <section className="rounded-3xl border border-white bg-white/95 p-6 shadow-xl shadow-slate-900/5 sm:p-8 xl:p-10" aria-labelledby="form-heading">
      <StepIndicator step={step} />
      <h2 ref={heading} tabIndex={-1} id="form-heading" className="mt-8 text-2xl font-semibold tracking-tight outline-none">{headings[step]}</h2>
      <p className="mt-2 mb-6 text-sm leading-relaxed text-neutral-500">{descriptions[step]}</p>
      <form onSubmit={submit}>
        <FormFields step={step} answers={answers} onChange={(name, value) => { setPrepared(false); setAnswers((previous) => ({ ...previous, [name]: value })); }} />
        {step === 2 && <p className="mt-4 text-xs leading-relaxed text-neutral-500">Последний шаг откроет вашу почтовую программу с заполненным письмом. Проверьте его и нажмите «Отправить».</p>}
        <div className="mt-6 flex gap-3">
          {step > 0 && <button type="button" onClick={() => changeStep(step - 1)} className="rounded-xl border border-brand-200 px-4 py-3 text-sm hover:bg-brand-50">Назад</button>}
          <button type="submit" className="action-gradient flex min-h-12 flex-1 items-center justify-center gap-3 rounded-xl px-4 py-3 font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500">{step < 2 ? "Далее" : "Подготовить письмо"}<span aria-hidden="true">→</span></button>
        </div>
      </form>
      {prepared && <div role="status" className="mt-5 rounded-xl bg-brand-50 p-4 text-sm leading-relaxed">Письмо подготовлено, но ещё не отправлено. Если почтовая программа не открылась, <a href={mailto} className="text-brand-600 underline">попробуйте ещё раз</a> или напишите на <a href="mailto:info@globalteacherhub.com" className="break-words text-brand-600 underline">info@globalteacherhub.com</a>.</div>}
      <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-neutral-500"><span aria-hidden="true">◇</span>Ответы остаются на этой странице до открытия письма. Для отправки потребуется ваша почтовая программа.</p>
    </section>
  );
}
