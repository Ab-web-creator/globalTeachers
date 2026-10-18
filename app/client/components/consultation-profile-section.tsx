"use client";

import { ClientProfileFieldIcon } from "@/app/components/svg";
import styles from "./consultation-profile-section.module.css";
import { useState, type FormEvent } from "react";
import type { Answers } from "../../consultation/components/form-fields";
import FormFields from "../../consultation/components/form-fields";
import { consultationSteps } from "../../consultation/components/consultation-steps";
import { missingProfileFields, profileLabels } from "../../../lib/client-area/profile-fields";

const fieldClass = "mt-2 w-full rounded-xl border border-brand-200 bg-white px-4 py-3 text-base focus:outline-2 focus:-outline-offset-2 focus:outline-brand-300";

export default function ConsultationProfileSection({ initial, admin, onSaved }: {
  initial: Answers; admin: boolean; onSaved: (profile: Answers) => void;
}) {
  const [answers, setAnswers] = useState(initial);
  const [savedAnswers, setSavedAnswers] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const missing = missingProfileFields(admin ? initial : answers);
  const hasChanges = (Object.keys(profileLabels) as (keyof Answers)[]).some(
    field => answers[field] !== savedAnswers[field],
  );
  function change(field: keyof Answers, value: string) {
    setAnswers(current => ({ ...current, [field]: value }));
    setStatus("");
  }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !hasChanges) return;
    setBusy(true); setError(""); setStatus("");
    try {
      const response = await fetch("/api/client/profile", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: answers }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Не удалось сохранить анкету.");
      setAnswers(result.profile); setSavedAnswers(result.profile); onSaved(result.profile); setStatus("Анкета сохранена.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Не удалось сохранить анкету."); }
    finally { setBusy(false); }
  }
  return (
    <section className={`${admin ? "" : "mt-10"} border-brand-100 bg-white p-5 ${admin ? "-mx-5 border-0 sm:mx-0 sm:rounded-3xl sm:border sm:shadow-sm sm:p-5 lg:min-h-0 lg:flex-1 lg:overflow-y-auto" : "rounded-3xl border sm:p-8"}`} aria-labelledby="client-profile-heading">
      <h2 id="client-profile-heading" className="text-2xl font-semibold">{admin ? "Анкета клиента" : "Ваша анкета"}</h2>
      {missing.length > 0 ? (
        <p role="status" className="mt-7 rounded-xl border border-amber-200 bg-amber-50 p-4 text-base text-amber-900">
          {admin ? "Клиент ещё не заполнил все обязательные поля." : "Заполните недостающие данные. Можно сохранить анкету частично и вернуться к ней позже."} <span className="text-red-600">Не заполнено:</span> {missing.join(", ")}.
        </p>
      ) : <p className={`${admin ? "mt-2 text-sm" : "mt-7 text-base"} text-emerald-700`}>Все обязательные поля заполнены.</p>}
      {admin ? (
        <dl className="mt-4 grid gap-x-5 sm:grid-cols-2">
          {Object.entries(profileLabels).map(([field, label]) => (
            <div key={field} className="flex min-w-0 items-start gap-3 border-b border-brand-100 py-3 last:border-b-0 sm:last:border-b">
              <ClientProfileFieldIcon field={field as keyof Answers} className="mt-0.5 size-5 shrink-0 text-brand-500" />
              <div className="min-w-0">
                <dt className="text-sm text-neutral-500">{label}</dt>
                <dd className="mt-1 whitespace-pre-wrap break-words text-base">{initial[field as keyof Answers] || <span className="text-red-600">Не заполнено</span>}</dd>
              </div>
            </div>
          ))}
        </dl>
      ) : (
        <form onSubmit={save} noValidate className={`mt-7 ${styles.form}`}>
          <fieldset disabled={busy} className="grid min-w-0 gap-6 sm:grid-cols-2">
            <label className={`block text-sm font-medium ${!answers.firstName.trim() ? styles.missing : ""}`}>Имя<input aria-invalid={!answers.firstName.trim()} value={answers.firstName} onChange={event => change("firstName", event.target.value)} autoComplete="given-name" maxLength={100} className={fieldClass} /></label>
            <label className={`block text-sm font-medium ${!answers.lastName.trim() ? styles.missing : ""}`}>Фамилия<input aria-invalid={!answers.lastName.trim()} value={answers.lastName} onChange={event => change("lastName", event.target.value)} autoComplete="family-name" maxLength={100} className={fieldClass} /></label>
            <label className="block text-sm font-medium">Email<input value={answers.email} readOnly type="email" autoComplete="email" aria-describedby="profile-email-note" className={`${fieldClass} text-neutral-500`} /><span id="profile-email-note" className="mt-2 block text-sm font-normal text-neutral-500">Email связан с вашим персональным ключом.</span></label>
            {consultationSteps.map((step, index) => {
              const field = step.fields[0];
              if (field === "firstName" || field === "email" || field === "packagePreference") return null;
              const incomplete = !answers[field].trim();
              return <div key={field} className={`min-w-0 ${incomplete ? styles.missing : ""}`}><FormFields step={index} answers={answers} onChange={change} /></div>;
            })}
            <label className="block text-sm font-medium">WhatsApp / Telegram (необязательно)<input value={answers.contact} onChange={event => change("contact", event.target.value)} maxLength={300} className={fieldClass} /></label>
            <label className="block text-sm font-medium">Ситуация и вопросы (необязательно)<textarea value={answers.goals} onChange={event => change("goals", event.target.value)} maxLength={1500} rows={3} className={fieldClass} /></label>
          </fieldset>
          <button disabled={busy || !hasChanges} type="submit" className="mt-6 rounded-xl border border-transparent bg-brand-500 px-6 py-3 text-base font-medium text-white enabled:hover:bg-brand-600 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:border-neutral-300 disabled:bg-transparent disabled:text-neutral-400">{busy ? "Сохранение…" : "Сохранить анкету"}</button>
          {status && <p role="status" className="mt-3 text-sm text-emerald-700">{status}</p>}
          {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
        </form>
      )}
    </section>
  );
}
