"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";

type Props = { to?: string; subject?: string; replyTo?: string; quote?: string; mailbox: string };

export default function ComposeForm({ to = "", subject = "", replyTo, quote = "", mailbox }: Props) {
  const router = useRouter();
  const busy = useRef(false);
  // One id per draft makes a retried submission idempotent instead of sending twice.
  const [id, setId] = useState(() => crypto.randomUUID());
  const [fields, setFields] = useState({ to, cc: "", subject, text: `\n\nС уважением,\nкоманда TeacherNavigator\n${mailbox}${quote}` });
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
  const input = "mt-2 w-full rounded-xl border border-brand-200 bg-white px-4 py-3 font-normal";
  return (
    <form onSubmit={send} className="mt-6 rounded-3xl border border-brand-100 bg-white p-6">
      <fieldset disabled={sending} className="space-y-4">
        <label className="block text-sm font-medium">Кому
          <input type="text" inputMode="email" required value={fields.to} onChange={update("to")} placeholder="teacher@example.com" className={input} />
        </label>
        <label className="block text-sm font-medium">Копия <span className="font-normal text-neutral-500">— необязательно, через запятую</span>
          <input type="text" inputMode="email" value={fields.cc} onChange={update("cc")} className={input} />
        </label>
        <label className="block text-sm font-medium">Тема
          <input type="text" required maxLength={300} value={fields.subject} onChange={update("subject")} className={input} />
        </label>
        <label className="block text-sm font-medium">Текст
          <textarea required rows={14} maxLength={50000} value={fields.text} onChange={update("text")} className={`${input} leading-normal`} />
        </label>
      </fieldset>
      {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
      <div className="mt-6 flex justify-end">
        <button type="submit" disabled={sending} className="rounded-xl bg-brand-500 px-6 py-3 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50">{sending ? "Отправляем…" : "Отправить"}</button>
      </div>
    </form>
  );
}
