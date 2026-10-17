"use client";

import { useEffect, useRef, useState } from "react";
import { DeleteApplicationIcon, EditApplicationIcon } from "@/app/components/svg";

export default function ChatMessageActions({ body, onEdit, onDelete, admin = true }: { admin?: boolean; body: string; onEdit: (body: string) => Promise<void>; onDelete: () => Promise<void> }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(body);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const [editorWidth, setEditorWidth] = useState<number>();
  const editorRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (!editing) return;
    const previous = document.activeElement;
    const editor = editorRef.current;
    editor?.focus();
    editor?.setSelectionRange(editor.value.length, editor.value.length);
    return () => { if (previous instanceof HTMLElement) previous.focus({ preventScroll: true }); };
  }, [editing]);
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || !editing) return;
    editor.style.height = "auto";
    editor.style.height = `${Math.min(editor.scrollHeight, window.innerHeight * 0.5)}px`;
  }, [draft, editing]);
  useEffect(() => {
    if (!editing) return;
    const root = rootRef.current;
    const log = root?.closest<HTMLElement>('[role="log"]');
    if (!root || !log) return;
    const revealEditor = () => {
      const editor = root.getBoundingClientRect();
      const viewport = log.getBoundingClientRect();
      const padding = 12;
      if (editor.height > log.clientHeight - padding * 2) {
        log.scrollTop += editor.top - viewport.top - padding;
      } else if (editor.bottom > viewport.bottom - padding) {
        log.scrollTop += editor.bottom - viewport.bottom + padding;
      } else if (editor.top < viewport.top + padding) {
        log.scrollTop += editor.top - viewport.top - padding;
      }
    };
    const frame = requestAnimationFrame(revealEditor);
    const observer = new ResizeObserver(revealEditor);
    observer.observe(root);
    observer.observe(log);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [editing]);

  async function mutate(remove: boolean) {
    if (busy || (!remove && !draft.trim())) return;
    if (remove && !window.confirm(admin ? "Удалить сообщение у вас и клиента?" : "Удалить своё сообщение? У администратора сохранится копия с отметкой об удалении.")) return;
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
    <div ref={rootRef} className="max-w-full" style={editing ? { width: editorWidth } : undefined}>
      {editing ? (
        <form onSubmit={event => { event.preventDefault(); void mutate(false); }} onKeyDown={event => { if (event.key === "Escape" && !busy) { event.stopPropagation(); setEditing(false); } }} className="w-full rounded-xl border border-brand-200 bg-white p-2">
          <textarea ref={editorRef} aria-label="Текст сообщения" value={draft} onChange={event => setDraft(event.target.value)} maxLength={5000} rows={4} disabled={busy} className="min-h-32 w-full resize-none overflow-y-auto rounded-xl border border-brand-200 bg-brand-50/40 p-3 text-base leading-relaxed focus:outline-2 focus:-outline-offset-2 focus:outline-brand-500" />
          {error && <p role="alert" className="mt-2 text-sm text-red-600">{error}</p>}
          <div className="mt-3 flex flex-wrap justify-end gap-2">
            <button type="button" disabled={busy} onClick={() => setEditing(false)} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-brand-500 hover:bg-brand-50">Отмена</button>
            <button disabled={busy || !draft.trim() || draft.trim() === body.trim()} className="rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50">{busy ? "Сохраняем…" : "Сохранить"}</button>
          </div>
        </form>
      ) : (
        <div className="flex justify-end gap-0">
          <button type="button" disabled={busy} onClick={() => { const bubble = rootRef.current?.closest("[data-chat-message]")?.querySelector("[data-message-bubble]"); setEditorWidth(bubble?.getBoundingClientRect().width); setDraft(body); setError(""); setEditing(true); }} aria-label="Редактировать сообщение" title="Редактировать" className="flex size-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-brand-50 hover:text-brand-600 focus-visible:-outline-offset-2"><EditApplicationIcon className="size-4" /></button>
          <button type="button" disabled={busy} onClick={() => void mutate(true)} aria-label="Удалить сообщение" title={admin ? "Удалить у всех" : "Удалить сообщение"} className="flex size-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-red-50 hover:text-red-600 focus-visible:-outline-offset-2"><DeleteApplicationIcon className="size-4" /></button>
        </div>
      )}
      {error && !editing && <p role="alert" className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
