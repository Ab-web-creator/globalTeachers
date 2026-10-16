"use client";

import { useState } from "react";
import { CopyKeyIcon } from "@/app/components/svg";

export default function CopyClientKeyButton({ clientId }: { clientId: string }) {
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [manualLink, setManualLink] = useState("");

  async function copy() {
    if (busy) return;
    setBusy(true); setCopied(false); setError(""); setManualLink("");
    try {
      const response = await fetch("/api/admin/clients", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "copy-key", clientId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Не удалось получить ключ.");
      try {
        await navigator.clipboard.writeText(result.link);
        setCopied(true);
      } catch { setManualLink(result.link); }
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Не удалось скопировать ключ."); }
    finally { setBusy(false); }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button type="button" onClick={() => void copy()} disabled={busy} className="flex items-center justify-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-brand-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-300 disabled:opacity-50">
        <CopyKeyIcon className="size-4" />
        {busy ? "Загрузка…" : copied ? "Ключ скопирован" : "Скопировать ключ"}
      </button>
      {copied && <span role="status" className="sr-only">Ключ клиента скопирован</span>}
      {manualLink && <label className="max-w-xs text-sm text-neutral-600">Скопируйте ссылку вручную<input aria-label="Персональная ссылка клиента" readOnly value={manualLink} onFocus={event => event.target.select()} className="mt-1 w-full rounded-xl border border-brand-200 bg-white px-3 py-2 text-base focus:outline-2 focus:-outline-offset-2 focus:outline-brand-500" /></label>}
      {error && <p role="alert" className="max-w-xs text-right text-sm text-red-700">{error}</p>}
    </div>
  );
}
