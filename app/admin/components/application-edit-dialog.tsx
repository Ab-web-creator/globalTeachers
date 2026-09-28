import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Answers } from "../../consultation/components/form-fields";
import ApplicationEditFields from "./application-edit-fields";

type Props = { id: string; status: "pending" | "confirmed"; answers: Answers; onClose: () => void; onSaved: () => void };

export default function ApplicationEditDialog({ id, status, answers, onClose, onSaved }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const busy = useRef(false);
  const [draft, setDraft] = useState(answers);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    if (!draft.subject) { setError("Выберите хотя бы один предмет."); return; }
    busy.current = true;
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/admin/edit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status, answers: draft, originalAnswers: answers }) });
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error || "Не удалось сохранить изменения. Обновите страницу и попробуйте снова.");
      }
      onSaved();
      dialog.current?.close();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Не удалось сохранить изменения.");
    } finally { busy.current = false; setSaving(false); }
  }

  return (
    <dialog ref={dialog} aria-labelledby="edit-application-title" onClose={(event) => { if (!event.currentTarget.open) onClose(); }} onCancel={(event) => { if (busy.current) event.preventDefault(); }} className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl overflow-hidden rounded-3xl bg-white p-0 text-brand-700 shadow-2xl backdrop:bg-brand-950/50">
      <form onSubmit={save} className="flex max-h-[90dvh] flex-col">
        <header className="shrink-0 border-b border-brand-100 px-6 py-5"><h2 id="edit-application-title" className="text-xl font-semibold">Редактировать заявку</h2><p className="mt-1 break-words text-sm text-neutral-500">{answers.name}</p></header>
        <fieldset disabled={saving} className="min-h-0 overflow-y-auto overscroll-contain p-6"><ApplicationEditFields answers={draft} onChange={(name, value) => { setError(""); setDraft((previous) => ({ ...previous, [name]: value })); }} /></fieldset>
        <footer className="shrink-0 border-t border-brand-100 p-5">
          {error && <p role="alert" className="mb-3 text-sm text-red-700">{error}</p>}
          <div className="flex justify-end gap-3">
            <button type="button" disabled={saving} onClick={() => dialog.current?.close()} className="rounded-xl border border-brand-200 px-4 py-3 text-sm disabled:opacity-50">Отмена</button>
            <button type="submit" disabled={saving} className="rounded-xl bg-brand-500 px-5 py-3 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50">{saving ? "Сохраняем…" : "Сохранить"}</button>
          </div>
        </footer>
      </form>
    </dialog>
  );
}
