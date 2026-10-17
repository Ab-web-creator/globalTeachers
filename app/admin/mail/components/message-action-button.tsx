"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition, type ReactNode } from "react";

type Props = {
  id: string; endpoint: string; returnTo: string; icon: ReactNode; label: string; busyLabel: string;
  confirmation?: string; danger?: boolean;
};

/** Posts the email id to an admin endpoint, then leaves the email page for its folder. */
export default function MessageActionButton({ id, endpoint, returnTo, icon, label, busyLabel, confirmation, danger = false }: Props) {
  const router = useRouter();
  const busy = useRef(false);
  const [working, setWorking] = useState(false);
  const [leaving, startTransition] = useTransition();
  const [error, setError] = useState("");

  async function run() {
    if (busy.current || (confirmation && !window.confirm(confirmation))) return;
    busy.current = true;
    setWorking(true);
    setError("");
    try {
      const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error || "Не получилось. Обновите страницу и попробуйте снова.");
      }
      startTransition(() => { router.replace(returnTo); router.refresh(); });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Не получилось.");
      busy.current = false;
      setWorking(false);
    }
  }

  const hover = danger ? "hover:text-red-400" : "hover:text-neutral-500";
  return (
    <>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <button type="button" onClick={run} aria-label={working || leaving ? busyLabel : label} title={label} disabled={working || leaving} className={`flex items-center justify-center text-sm transition-colors disabled:cursor-wait disabled:opacity-50 size-7 rounded-full text-neutral-400 ${hover}`}>
        {icon}
      </button>
    </>
  );
}
