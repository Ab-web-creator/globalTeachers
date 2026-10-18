"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import { useEffect, useRef, useState } from "react";
import { DeleteApplicationIcon } from "@/app/components/svg";

export default function ClearChatDialog({ onConfirm, onClose }: { onConfirm: (scope: "admin" | "client" | "both") => Promise<void>; onClose: () => void }) {
  const t = useTranslations();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [scope, setScope] = useState<"admin" | "client" | "both">("admin");
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
    try { await onConfirm(scope); onClose(); }
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
      <h2 id="clear-chat-title" className="text-xl font-semibold">{t("client.clearChatDialog.message0038")}</h2>
      <p id="clear-chat-description" className="mt-3 text-sm leading-relaxed text-neutral-600">{t("client.clearChatDialog.message0039")}</p>
      <fieldset disabled={busy} className="mt-4 space-y-2">
        <legend className="sr-only">{t("client.clearChatDialog.message0040")}</legend>
        {([
          { value: "admin", label: "Только у меня", description: "Клиент продолжит видеть переписку." },
          { value: "client", label: "Только у клиента", description: "У вас останется копия с отметкой об удалении у клиента." },
          { value: "both", label: "У меня и клиента", description: "Переписка исчезнет с обеих сторон." },
        ] as const).map(option => (
          <label key={option.value} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 ${scope === option.value ? "border-brand-300 bg-brand-50" : "border-neutral-200"}`}>
            <input type="radio" name="clear-chat-scope" value={option.value} checked={scope === option.value} onChange={() => setScope(option.value)} className="mt-1 shrink-0 accent-brand-500 text-base focus-visible:-outline-offset-2" />
            <span><span className="block text-sm font-medium">{t.content(option.label)}</span><span className="mt-1 block text-xs leading-relaxed text-neutral-500">{t.content(option.description)}</span></span>
          </label>
        ))}
      </fieldset>
      {t.content(error && <p role="alert" className="mt-3 text-sm text-red-600">{t.content(error)}</p>)}
      <div className="mt-6 flex justify-end gap-2">
        <button type="button" autoFocus disabled={busy} onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-brand-500 hover:bg-brand-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-500 disabled:opacity-50">{t("common.cancel")}</button>
        <button type="button" disabled={busy} onClick={() => void confirm()} className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-red-500 disabled:opacity-50">{t.content(busy ? "Удаляем…" : "Удалить всё")}</button>
      </div>
    </dialog>
  );
}
