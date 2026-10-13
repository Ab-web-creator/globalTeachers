"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import styles from "./compose-form.module.css";

type Props = { to?: string; subject?: string; text?: string; replyTo?: string; quote?: string; mailbox: string };

export default function ComposeForm({ to = "", subject = "", text = "", replyTo, quote = "", mailbox }: Props) {
  const router = useRouter();
  const busy = useRef(false);
  // One id per draft makes a retried submission idempotent instead of sending twice.
  const [id, setId] = useState(() => crypto.randomUUID());
  const [fields, setFields] = useState({ to, cc: "", subject, text: `${text}\n\nС уважением,\nкоманда TeacherNavigator\n${mailbox}${quote}` });
  const [showCc, setShowCc] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    busy.current = true;
    setSending(true);
    setError("");
    try {
      const response = await fetch("/admin/mail/send", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...fields, replyTo: replyTo ?? null }) });
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error || "Не удалось отправить письмо. Попробуйте ещё раз.");
      }
      router.push("/admin/mail?folder=sent");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Не удалось отправить письмо.");
      busy.current = false;
      setSending(false);
    }
  }

  // Resend rejects a reused idempotency key with a different body, so an edited draft gets a new id.
  const update = (name: keyof typeof fields) => (event: { target: { value: string } }) => {
    if (error) { setError(""); setId(crypto.randomUUID()); }
    setFields((previous) => ({ ...previous, [name]: event.target.value }));
  };
  const row = "flex items-center gap-3 border-b border-brand-100 px-6";
  const input = `${styles.field} min-w-0 flex-1 bg-transparent py-3 text-sm outline-none`;
  return (
    <form onSubmit={send} className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-brand-100 px-6 py-3">
        <p className="text-xs text-neutral-500">Отправитель: {mailbox}</p>
        <div className="flex items-center gap-3">
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={sending} className="rounded-xl bg-brand-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50">{sending ? "Отправляем…" : "Отправить"}</button>
        </div>
      </div>
      <fieldset disabled={sending} className="flex min-h-0 flex-1 flex-col">
        <label className={row}><span className="w-14 shrink-0 text-sm text-neutral-500">Кому</span>
          <input type="text" inputMode="email" required value={fields.to} onChange={update("to")} placeholder="teacher@example.com" className={input} />
          {!showCc && <button type="button" onClick={() => setShowCc(true)} className="text-sm text-brand-600">Копия</button>}
        </label>
        {showCc && (
          <label className={row}><span className="w-14 shrink-0 text-sm text-neutral-500">Копия</span>
            <input type="text" inputMode="email" value={fields.cc} onChange={update("cc")} placeholder="через запятую" className={input} />
          </label>
        )}
        <label className={row}><span className="w-14 shrink-0 text-sm text-neutral-500">Тема</span>
          <input type="text" autoFocus required maxLength={300} value={fields.subject} onChange={update("subject")} className={input} />
        </label>
        <textarea required aria-label="Текст письма" maxLength={50000} value={fields.text} onChange={update("text")} className={`${styles.field} min-h-80 flex-1 resize-none px-6 py-4 text-sm leading-normal outline-none`} />
      </fieldset>
    </form>
  );
}
