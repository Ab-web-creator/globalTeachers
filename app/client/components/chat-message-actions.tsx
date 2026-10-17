"use client";

import { useState } from "react";
import { DeleteApplicationIcon, EditApplicationIcon } from "@/app/components/svg";

export default function ChatMessageActions({ body, onEdit, onDelete }: { body: string; onEdit: (body: string) => Promise<void>; onDelete: () => Promise<void> }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(body);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function mutate(remove: boolean) {
    if (busy || (!remove && !draft.trim())) return;
    if (remove && !window.confirm("Удалить сообщение у вас и клиента?")) return;
    setBusy(true);
    setError("");
    try {
      if (remove) await onDelete();
      else { await onEdit(draft.trim()); setEditing(false); }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Не удалось изменить сообщение.");
    } finally { setBusy(false); }
  }

  return (
    <div className="max-w-full">
      {editing ? (
        <form onSubmit={event => { event.preventDefault(); void mutate(false); }} className="w-72 max-w-full rounded-xl border border-brand-200 bg-white p-2">
          <textarea aria-label="Редактировать сообщение" value={draft} onChange={event => setDraft(event.target.value)} maxLength={5000} rows={3} disabled={busy} className="w-full resize-y rounded-lg border border-brand-200 p-2 text-base focus:outline-2 focus:-outline-offset-2 focus:outline-brand-500" />
          <div className="mt-2 flex gap-2">
            <button disabled={busy || !draft.trim()} className="rounded-lg bg-brand-500 px-3 py-2 text-sm text-white disabled:opacity-50">Сохранить</button>
            <button type="button" disabled={busy} onClick={() => setEditing(false)} className="rounded-lg px-3 py-2 text-sm text-neutral-600">Отмена</button>
          </div>
        </form>
      ) : (
        <div className="flex justify-end gap-0">
          <button type="button" disabled={busy} onClick={() => { setDraft(body); setError(""); setEditing(true); }} aria-label="Редактировать сообщение" title="Редактировать" className="flex size-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-brand-50 hover:text-brand-600 focus-visible:-outline-offset-2"><EditApplicationIcon className="size-4" /></button>
          <button type="button" disabled={busy} onClick={() => void mutate(true)} aria-label="Удалить сообщение" title="Удалить у всех" className="flex size-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-red-50 hover:text-red-600 focus-visible:-outline-offset-2"><DeleteApplicationIcon className="size-4" /></button>
        </div>
      )}
      {error && <p role="alert" className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
