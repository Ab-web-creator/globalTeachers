"use client";

import { useEffect, useRef, useState } from "react";
import { DeleteApplicationIcon } from "@/app/components/svg";

export default function ClearChatDialog({ onConfirm, onClose }: { onConfirm: () => Promise<void>; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [busy, setBusy] = useState(false);
  const submitting = useRef(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    const previous = document.activeElement;
    dialog?.showModal();
    return () => { dialog?.close(); if (previous instanceof HTMLElement) previous.focus({ preventScroll: true }); };
  }, []);

  async function confirm() {
    if (submitting.current) return;
    submitting.current = true;
    setBusy(true);
    setError("");
    try { await onConfirm(); onClose(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Не удалось удалить сообщения."); }
    finally { submitting.current = false; setBusy(false); }
  }

  return (
    <dialog ref={dialogRef} aria-labelledby="clear-chat-title" aria-describedby="clear-chat-description" aria-busy={busy}
      onCancel={event => { event.preventDefault(); if (!busy) onClose(); }}
      onClick={event => {
        if (busy || event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
      }}
      className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-sm overflow-y-auto rounded-3xl border-0 bg-white p-6 text-brand-700 shadow-2xl backdrop:bg-neutral-950/40 backdrop:backdrop-blur-sm">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-red-50 text-red-500"><DeleteApplicationIcon className="size-6" /></div>
      <h2 id="clear-chat-title" className="text-xl font-semibold">Удалить всю переписку?</h2>
      <p id="clear-chat-description" className="mt-3 text-sm leading-relaxed text-neutral-600">Все сообщения исчезнут у вас и клиента. Восстановить переписку будет невозможно.</p>
      {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
      <div className="mt-6 flex justify-end gap-2">
        <button type="button" autoFocus disabled={busy} onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-brand-500 hover:bg-brand-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-500 disabled:opacity-50">Отмена</button>
        <button type="button" disabled={busy} onClick={() => void confirm()} className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-red-500 disabled:opacity-50">{busy ? "Удаляем…" : "Удалить всё"}</button>
      </div>
    </dialog>
  );
}
