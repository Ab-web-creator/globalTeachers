"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import { ResearchIdeaIcon } from "@/app/components/svg";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import FormFields, { emptyAnswers, type Answers } from "./form-fields";
import SubmissionSuccess from "./submission-success";
import StepIndicator from "./step-indicator";
import FormNavigation from "./form-navigation";
import NameFields from "./name-fields";

import { consultationSteps } from "./consultation-steps";
import { validateStep } from "./validate-step";
import useDraftSave from "./use-draft-save";
import { educationNotice } from "./education-notice";
import { englishNotice, isBeginnerEnglish } from "./english-notice";
import { getSubjectNotice, subjectNotices, type SubjectNoticeKind } from "./subject-notices";

export default function ConsultationForm() {
  const t = useTranslations();
  const router = useRouter();
  const [outcome, setOutcome] = useState<"unsupported_subjects" | "not-enough-education" | "not-enough-english" | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(emptyAnswers);
  const [sent, setSent] = useState(false);
  const [confirmationDestination, setConfirmationDestination] = useState("/");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [errorField, setErrorField] = useState("");
  const [educationNoticeOpen, setEducationNoticeOpen] = useState(false);
  const [englishNoticeOpen, setEnglishNoticeOpen] = useState(false);
  const [noticeKind, setNoticeKind] = useState<SubjectNoticeKind | null>(null);
  const noticeButton = useRef<HTMLButtonElement>(null);
  const notice = educationNoticeOpen ? { ...educationNotice, exclusion: "", recommendStart: false } : englishNoticeOpen ? { ...englishNotice, exclusion: "", recommendStart: false } : noticeKind ? subjectNotices[noticeKind] : null;
  const noticeOpen = educationNoticeOpen || englishNoticeOpen || noticeKind !== null;
  const submitting = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const scrollArea = useRef<HTMLDivElement>(null);
  const errorMessage = useRef<HTMLParagraphElement>(null);
  const isEnglishStep = consultationSteps[step].fields[0] === "english";

  const draft = useDraftSave(answers, step, sending || sent || outcome !== null);

  useEffect(() => {
    if (!noticeOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    noticeButton.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, [noticeOpen]);

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
  async function finishCase(result: "unsupported_subjects" | "not-enough-education" | "not-enough-english") {
    if (submitting.current) return;
    submitting.current = true;
    setSending(true);
    setError("");
    try {
      await draft.finishCase(result);
      setNoticeKind(null);
      setEducationNoticeOpen(false);
      setEnglishNoticeOpen(false);
      setOutcome(result);
      requestAnimationFrame(() => { resetScroll(); heading.current?.focus({ preventScroll: true }); });
    } finally {
      submitting.current = false;
      setSending(false);
    }
  }

  async function closeOutcome(destination: "/" | "/#plans") {
    if (outcome !== "not-enough-education" && outcome !== "not-enough-english") { router.push(destination); return; }
    if (submitting.current) return;
    submitting.current = true;
    setSending(true);
    setError("");
    try {
      await draft.finishCase(outcome, true);
      setConfirmationDestination(destination);
      setSent(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Не удалось отправить письмо. Попробуйте ещё раз.");
    } finally {
      submitting.current = false;
      setSending(false);
    }
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
    if (consultationSteps[step].fields[0] === "subject") {
      const kind = getSubjectNotice(answers.subject.split("; "));
      if (kind) {
        setNoticeKind(kind);
        return;
      }
    }
    if (step < consultationSteps.length - 1) return changeStep(step + 1);
    if (submitting.current) return;
    submitting.current = true;
    setSending(true);
    setError("");
    try {
      await draft.waitForSave();
      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...answers, draft: draft.getIdentity() }),
      });
      const result = await response.json();
      if (!response.ok && result.field) {
        const stepField = result.field === "lastName" ? "firstName" : result.field;
        const invalidStep = consultationSteps.findIndex((item) => item.fields[0] === stepField);
        if (invalidStep >= 0) {
          changeStep(invalidStep);
          setErrorField(result.field);
          setError(result.error);
          return;
        }
      }
      if (!response.ok) throw new Error(result.error || "Не удалось сохранить заявку.");
      setConfirmationDestination("/");
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
    <section className="consultation-form relative flex h-full min-h-0 min-w-0 flex-col overflow-hidden bg-white lg:rounded-3xl lg:shadow-surround lg:shadow-brand-950/8" aria-labelledby={sent ? "verification-heading" : "form-heading"}>
      {outcome ? <div inert={sent} className="flex min-h-0 flex-1 flex-col">
        <div ref={scrollArea} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="bg-white px-4 py-5 lg:px-8 lg:py-8 xl:px-10 xl:py-10">
            <StepIndicator step={step} />
            <h2 ref={heading} tabIndex={-1} id="form-heading" className="mt-5 text-2xl font-semibold tracking-tight outline-none sm:mt-8">{t.content(consultationSteps[step].title)}</h2>
            <p id="step-description" className={`mt-2 text-sm leading-relaxed ${outcome === "not-enough-english" ? "text-purple-900" : "text-neutral-500"}`}>{outcome === "not-enough-english" ? <>{t("consultation.consultationForm.message0474")}{answers.english}».</> : outcome === "not-enough-education" ? "Вы указали, что ваш уровень образования — среднее специальное." : consultationSteps[step].description}</p>
          </div>
          <div className="px-4 py-6 lg:px-8 lg:py-8 xl:px-10 xl:py-10">
            <fieldset disabled aria-label={t.content(outcome === "unsupported_subjects" ? "Выбранные предметы" : outcome === "not-enough-english" ? "Выбранный уровень английского" : "Выбранное образование")}>
              <FormFields step={step} answers={answers} onChange={() => {}} />
            </fieldset>
            {outcome === "unsupported_subjects" && <p role="status" className="mt-7 text-base leading-relaxed">{t("consultation.consultationForm.message0479")}</p>}
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-3 px-4 pt-6 pb-5 lg:px-8 lg:pb-8 xl:px-10 xl:pb-10">
          {t.content(error && <p role="alert" className="text-sm text-red-700">{t.content(error)}</p>)}
          <div className="flex gap-3">
            {outcome !== "unsupported_subjects" && <button type="button" disabled={sending} onClick={() => { void closeOutcome("/#plans"); }} className="min-h-12 flex-1 rounded-xl border border-brand-200 px-4 py-3 text-sm font-medium hover:bg-brand-50 disabled:opacity-50">{t.content(outcome === "not-enough-english" ? "Выбрать программу" : "Выбрать Start")}</button>}
            <button type="button" disabled={sending} onClick={() => { void closeOutcome("/"); }} className="action-gradient min-h-12 flex-1 rounded-xl px-4 py-3 font-medium text-white disabled:opacity-50">{t.content(sending ? "Отправляем…" : "Закрыть")}</button>
          </div>
        </div>
      </div> : !sent ? <form inert={noticeOpen} noValidate onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
        <fieldset disabled={sending} aria-describedby={error ? "step-error" : undefined} className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div ref={scrollArea} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <div className="flex min-h-full flex-col">
              <div className={`bg-white px-4 lg:px-8 xl:px-10 ${isEnglishStep ? "pt-5 pb-4 lg:pt-8 xl:pt-10" : "py-5 lg:py-8 xl:py-10"}`}>
                <StepIndicator step={step} />
                <h2 ref={heading} tabIndex={-1} id="form-heading" className="mt-5 text-2xl font-semibold tracking-tight outline-none sm:mt-8">{t.content(consultationSteps[step].title)}</h2>
                {consultationSteps[step].description && <p id="step-description" className="mt-2 text-sm leading-relaxed text-neutral-500">{t.content(consultationSteps[step].description)}</p>}
              </div>
              <div className={`flex min-w-0 flex-1 flex-col gap-6 bg-white px-4 lg:px-8 xl:px-10 ${isEnglishStep ? "pt-5.25 pb-6 lg:pb-8 xl:pb-10" : "py-6 lg:py-8 xl:py-10"}`}>
                <div>
                  {consultationSteps[step].fields[0] === "firstName"
                    ? <NameFields value={answers} error={error} errorField={errorField} errorRef={errorMessage} onChange={(value) => { setError(""); setAnswers((previous) => ({ ...previous, ...value })); }} />
                    : <FormFields step={step} answers={answers} onChange={(name, value) => { setError(""); setAnswers((previous) => ({ ...previous, [name]: value })); if (name === "english" && isBeginnerEnglish(value)) setEnglishNoticeOpen(true); if (name === "education" && value === "Среднее специальное") setEducationNoticeOpen(true); }} />}
                  {t.content(error && consultationSteps[step].fields[0] !== "firstName" && <p ref={errorMessage} id="step-error" role="alert" className={`mt-2 text-sm text-red-700 ${["country", "email", "subject", "goals"].includes(consultationSteps[step].fields[0]) ? "px-4" : ""}`}>{t.content(error)}</p>)}
                </div>
              </div>
            </div>
          </div>
          <div className="shrink-0 bg-white px-4 pb-5 lg:px-8 lg:pb-8 xl:px-10 xl:pb-10">
            <FormNavigation step={step} sending={sending} onBack={() => changeStep(step - 1)} />
          </div>
        </fieldset>
      </form> : null}
      {sent && <SubmissionSuccess email={answers.email.trim()} onClose={() => router.push(confirmationDestination)} onNew={() => {
        draft.startNew();
        setAnswers(emptyAnswers);
        setSent(false);
        setConfirmationDestination("/");
        setOutcome(null);
        changeStep(0);
      }} />}
      {notice && <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="consultation-notice-title"
        aria-describedby={educationNoticeOpen ? "consultation-notice-reason education-notice-recommendation" : englishNoticeOpen ? "consultation-notice-reason english-notice-recommendation" : "consultation-notice-reason consultation-notice-exclusion"}
        onKeyDown={(event) => {
          if (event.key === "Escape" && !sending) { event.preventDefault(); setNoticeKind(null); setEnglishNoticeOpen(false); setEducationNoticeOpen(false); }
          if (event.key === "Tab") {
            const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not(:disabled)"));
            const first = buttons[0];
            const last = buttons[buttons.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
          }
        }}
        className={`absolute inset-0 z-50 flex flex-col overflow-y-auto overscroll-contain bg-white py-8 text-brand-700 lg:rounded-3xl lg:p-8 xl:p-10 ${englishNoticeOpen ? "bg-linear-to-b from-brand-50/50 to-white px-6" : "px-4"}`}
      >
        <div className={englishNoticeOpen ? "" : "my-auto"}>
          {englishNoticeOpen ? (
            <div className="flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-brand-100 bg-white text-brand-500 shadow-sm">
                <ResearchIdeaIcon aria-hidden="true" className="size-6" />
              </span>
              <h3 id="consultation-notice-title" className="min-w-0 text-2xl font-semibold leading-snug tracking-tight text-brand-950">{t.content(notice.title)}</h3>
            </div>
          ) : <h3 id="consultation-notice-title" className="text-2xl font-semibold">{t.content(notice.title)}</h3>}
          <div id="consultation-notice-reason" className={`mt-7 space-y-5 text-base leading-relaxed ${englishNoticeOpen ? "text-neutral-600" : ""}`}>
            {typeof notice.reason === "string" ? englishNoticeOpen ? notice.reason.split(/ (?=С начальным уровнем)/).map((paragraph) => <p key={paragraph}>{t.content(paragraph)}</p>) : <p>{t.content(notice.reason)}</p> : notice.reason.map((paragraph) => (
              <p key={paragraph.text}>{t.content(paragraph.lead && <><strong>{t.content(paragraph.lead)}</strong>{t.content(" ")}</>)}{t.content(paragraph.text)}</p>
            ))}
          </div>
          {t.content(notice.exclusion && <p id="consultation-notice-exclusion" className="mt-4 text-base font-semibold leading-relaxed">{t.content(notice.exclusion)}</p>)}
          {!educationNoticeOpen && !englishNoticeOpen && noticeKind && <p className="mt-7 text-base leading-relaxed">{t.content(subjectNotices[noticeKind].recommendation)}</p>}
          {educationNoticeOpen && <p id="education-notice-recommendation" className="mt-4 text-base leading-relaxed">{t.content(educationNotice.recommendation)}</p>}
          {englishNoticeOpen && (
            <div className="mt-7 rounded-2xl border border-brand-100 bg-brand-50/70 p-5 sm:p-6">
              <p className="text-sm font-semibold text-brand-600">{t("consultation.consultationForm.message0483")}</p>
              <p id="english-notice-recommendation" className="mt-3 text-base leading-relaxed text-brand-800">{t.content(englishNotice.recommendation)}</p>
            </div>
          )}
          {notice.recommendStart && <p className="mt-4 text-base leading-relaxed">{t("consultation.consultationForm.message0484")}{" "}<strong>START</strong> {" "}{t("consultation.consultationForm.message0485")}</p>}
          {t.content(error && <p role="alert" className="mt-4 text-sm text-red-700">{t.content(error)}</p>)}
          {!englishNoticeOpen && <button ref={noticeButton} type="button" disabled={sending} onClick={() => { void finishCase(educationNoticeOpen ? "not-enough-education" : "unsupported_subjects").catch((cause) => setError(cause instanceof Error ? cause.message : "Не удалось сохранить заявку. Попробуйте ещё раз.")); }} className="mt-6 min-h-12 rounded-xl bg-brand-500 px-5 py-3 font-medium text-white hover:bg-brand-600">{t.content(sending ? "Сохраняем…" : "Продолжить")}</button>}
        </div>
        {englishNoticeOpen && <div className="mt-8 flex shrink-0 flex-col gap-3 border-t border-brand-100 pt-6">
          <button ref={noticeButton} type="button" disabled={sending} onClick={() => { void finishCase("not-enough-english").catch((cause) => setError(cause instanceof Error ? cause.message : "Не удалось сохранить заявку. Попробуйте ещё раз.")); }} className="action-gradient min-h-12 rounded-xl px-6 py-3 text-base font-semibold text-white transition-shadow hover:shadow-md disabled:opacity-50">{t.content(sending ? "Сохраняем…" : "Продолжить")}</button>
        </div>}
      </div>}
    </section>
  );
}
