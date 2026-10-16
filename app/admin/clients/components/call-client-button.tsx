"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PhoneCallIcon } from "@/app/components/svg";

export default function CallClientButton({ clientId }: { clientId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function call() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "call-client", clientId }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Не удалось позвонить.");
      router.push(`/admin/calls/${result.id}`);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Не удалось позвонить.",
      );
      setBusy(false);
    }
  }
  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={() => void call()}
        disabled={busy}
        className="flex items-center justify-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-brand-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-300 disabled:cursor-wait disabled:opacity-50"
      >
        <PhoneCallIcon className="size-4" />
        {busy ? "Вызываем…" : "Позвонить клиенту"}
      </button>
      {error && (
        <p role="alert" className="max-w-xs text-right text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
