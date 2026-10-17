"use client";

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
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const missing = missingProfileFields(admin ? initial : answers);
  function change(field: keyof Answers, value: string) {
    setAnswers(current => ({ ...current, [field]: value }));
    setStatus("");
  }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setError(""); setStatus("");
    try {
      const response = await fetch("/api/client/profile", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: answers }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Не удалось сохранить анкету.");
      setAnswers(result.profile); onSaved(result.profile); setStatus("Анкета сохранена.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Не удалось сохранить анкету."); }
    finally { setBusy(false); }
  }
  return (
    <section className={`mt-10 border-brand-100 bg-white p-5 sm:p-8 ${admin ? "-mx-5 border-y sm:mx-0 sm:rounded-3xl sm:border" : "rounded-3xl border"}`} aria-labelledby="client-profile-heading">
      <h2 id="client-profile-heading" className="text-2xl font-semibold">{admin ? "Анкета клиента" : "Ваша анкета"}</h2>
      {missing.length > 0 ? (
        <p role="status" className="mt-7 rounded-xl border border-amber-200 bg-amber-50 p-4 text-base text-amber-900">
          {admin ? "Клиент ещё не заполнил все обязательные поля." : "Заполните недостающие данные. Можно сохранить анкету частично и вернуться к ней позже."} <span className="text-red-600">Не заполнено:</span> {missing.join(", ")}.
        </p>
      ) : <p className="mt-7 text-base text-emerald-700">Все обязательные поля заполнены.</p>}
      {admin ? (
        <dl className="mt-7 grid gap-5 sm:grid-cols-2">
          {Object.entries(profileLabels).map(([field, label]) => <div key={field}><dt className="text-sm text-neutral-500">{label}</dt><dd className="mt-1 whitespace-pre-wrap break-words text-base">{initial[field as keyof Answers] || <span className="text-red-600">Не заполнено</span>}</dd></div>)}
        </dl>
      ) : (
        <form onSubmit={save} noValidate className="mt-7">
          <fieldset disabled={busy} className="grid min-w-0 gap-6 sm:grid-cols-2">
            <label className={`block text-sm font-medium ${!answers.name.trim() ? styles.missing : ""}`}>Имя и фамилия<input aria-invalid={!answers.name.trim()} value={answers.name} onChange={event => change("name", event.target.value)} autoComplete="name" maxLength={300} className={fieldClass} /></label>
            <label className="block text-sm font-medium">Email<input value={answers.email} readOnly type="email" autoComplete="email" aria-describedby="profile-email-note" className={`${fieldClass} text-neutral-500`} /><span id="profile-email-note" className="mt-2 block text-sm font-normal text-neutral-500">Email связан с вашим персональным ключом.</span></label>
            {consultationSteps.map((step, index) => {
              const field = step.fields[0];
              if (field === "name" || field === "email" || field === "packagePreference") return null;
              const incomplete = !answers[field].trim();
              return <div key={field} className={`min-w-0 ${incomplete ? styles.missing : ""}`}><FormFields step={index} answers={answers} onChange={change} /></div>;
            })}
            <label className="block text-sm font-medium">WhatsApp / Telegram (необязательно)<input value={answers.contact} onChange={event => change("contact", event.target.value)} maxLength={300} className={fieldClass} /></label>
            <label className="block text-sm font-medium">Ситуация и вопросы (необязательно)<textarea value={answers.goals} onChange={event => change("goals", event.target.value)} maxLength={1500} rows={3} className={fieldClass} /></label>
          </fieldset>
          <button disabled={busy} type="submit" className="mt-6 rounded-xl bg-brand-500 px-6 py-3 text-base font-medium text-white hover:bg-brand-600 disabled:opacity-50">{busy ? "Сохранение…" : "Сохранить анкету"}</button>
          {status && <p role="status" className="mt-3 text-sm text-emerald-700">{status}</p>}
          {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
        </form>
      )}
    </section>
  );
}
