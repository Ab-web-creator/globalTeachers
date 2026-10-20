"use client";

import { DeleteApplicationIcon } from "@/app/components/svg";
import { useRef, useState } from "react";

type Props = { clientId: string; name: string; onDeleted: () => void; className?: string };

export default function DeleteClientButton({ clientId, name, onDeleted, className = "" }: Props) {
  const busy = useRef(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function remove() {
    if (busy.current || !window.confirm(`Удалить личную страницу «${name}» навсегда? Чат, файлы и брони будут удалены, заявки останутся. Это действие нельзя отменить.`)) return;
    busy.current = true;
    setDeleting(true);
    setError("");
    try {
      const response = await fetch("/api/admin/clients", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "delete-client", clientId }) });
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error || "Не удалось удалить клиента. Обновите страницу и попробуйте снова.");
      }
      onDeleted();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Не удалось удалить клиента.");
    } finally {
      busy.current = false;
      setDeleting(false);
    }
  }

  return (
    <>
      <button type="button" onClick={remove} disabled={deleting} aria-label={`Удалить клиента: ${name}`} title="Удалить клиента" className={`flex shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-700 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-red-500 disabled:cursor-wait disabled:opacity-50 ${className}`}>
        <DeleteApplicationIcon />
      </button>
      {error && <p role="alert" className="basis-full text-sm text-red-700">{error}</p>}
    </>
  );
}
