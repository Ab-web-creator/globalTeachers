"use client";

import { useEffect, useRef, useState } from "react";
import { StrokeIcon, programIconPaths } from "@/app/components/svg";

export default function NewFileFolderDialog({ onCreate, onClose }: { onCreate: (name: string) => Promise<void>; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const submitting = useRef(false);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    const previous = document.activeElement;
    dialog?.showModal();
    return () => {
      dialog?.close();
      if (previous instanceof HTMLElement) previous.focus({ preventScroll: true });
    };
  }, []);

  async function create() {
    if (submitting.current || !name.trim()) return;
    submitting.current = true;
    setBusy(true);
    setError("");
    try { await onCreate(name.trim()); onClose(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Не удалось создать папку."); }
    finally { submitting.current = false; setBusy(false); }
  }

  return (
    <dialog ref={dialogRef} aria-labelledby="new-folder-title" aria-busy={busy}
      onCancel={event => { event.preventDefault(); if (!busy) onClose(); }}
      onClick={event => {
        if (busy || event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
      }}
      className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-sm overflow-y-auto rounded-3xl border-0 bg-white p-6 text-brand-700 shadow-2xl backdrop:bg-neutral-950/40 backdrop:backdrop-blur-sm">
      <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-500"><StrokeIcon path={programIconPaths.openFolder} className="size-7" /></div>
      <h2 id="new-folder-title" className="text-xl font-semibold">Новая папка</h2>
      <form onSubmit={event => { event.preventDefault(); void create(); }} className="mt-5">
        <label htmlFor="new-file-folder-name" className="text-sm font-medium">Название папки</label>
        <input id="new-file-folder-name" autoFocus required maxLength={80} disabled={busy} value={name} onChange={event => setName(event.target.value)} placeholder="Например, Учебные материалы" className="mt-2 w-full rounded-xl border border-brand-200 px-3 py-3 text-base focus:outline-2 focus:-outline-offset-2 focus:outline-brand-500" />
        {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" disabled={busy} onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-brand-500 hover:bg-brand-50">Отмена</button>
          <button disabled={busy || !name.trim()} className="rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50">{busy ? "Создаём…" : "Создать"}</button>
        </div>
      </form>
    </dialog>
  );
}
