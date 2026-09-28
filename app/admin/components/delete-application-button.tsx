"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = { id: string; status: "pending" | "confirmed"; name: string };

export default function DeleteApplicationButton({ id, status, name }: Props) {
  const router = useRouter();
  const busy = useRef(false);
  const [deleting, setDeleting] = useState(false);
  const [refreshing, startTransition] = useTransition();
  const [error, setError] = useState("");

  async function remove() {
    if (busy.current || !window.confirm(`Удалить заявку «${name}» навсегда? Это действие нельзя отменить.`)) return;
    busy.current = true;
    setDeleting(true);
    setError("");
    try {
      const response = await fetch("/admin/delete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error || "Не удалось удалить заявку. Обновите страницу и попробуйте снова.");
      }
      startTransition(() => router.refresh());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Не удалось удалить заявку.");
    } finally {
      busy.current = false;
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button type="button" onClick={remove} disabled={deleting || refreshing} aria-label={`Удалить заявку: ${name}`} title="Удалить навсегда" className="flex size-10 items-center justify-center rounded-xl text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-700 disabled:cursor-wait disabled:opacity-50">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-5"><path d="M3 6h18M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M5 6l1 14a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1l1-14M10 10v7M14 10v7" /></svg>
      </button>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    </div>
  );
}
