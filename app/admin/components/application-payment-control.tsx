"use client";

import { SubjectPickerChevronIcon } from "@/app/components/svg";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ClientTier } from "../../../lib/client-area/types";

export default function ApplicationPaymentControl({ messageId, clientId, paid, initialTier }: {
  messageId?: string;
  clientId?: string;
  paid: boolean;
  initialTier: ClientTier | null;
}) {
  const router = useRouter();
  const [tier, setTier] = useState<ClientTier | "">(paid ? initialTier ?? "" : "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function markPaid(value: ClientTier | "") {
    if (busy || value === tier) return;
    const warning = value
      ? `Изменить статус оплаты на ${value}? Пользователь станет клиентом ${value}, а его письма переместятся в соответствующую папку. Личная страница и ключ доступа будут готовы сразу. Ключ можно скопировать и передать клиенту любым удобным способом.`
      : "Отметить клиента как «Не заплатил(а)»? Аккаунт будет заморожен: клиент сохранит доступ к странице и предыдущей переписке, но не сможет отправлять новые сообщения и бронировать консультации. Его письма переместятся в папку «Замороженные».";
    if (!window.confirm(warning)) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: clientId ? "set-client-payment" : "mark-message-paid", messageId, clientId, tier: value || null }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Не удалось сохранить оплату.");
      setTier(value);
      window.dispatchEvent(new Event("client-payment-changed"));
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Не удалось сохранить оплату.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white py-2 pl-5 pr-3 text-base leading-5 text-neutral-600 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-brand-500 lg:text-sm">
          <span aria-hidden="true">{tier === "START" ? "Клиент Start" : tier === "PRO" ? "Клиент Pro" : tier === "VIP" ? "Клиент ViP" : "Не заплатил(а)"}</span>
          <select aria-label="Оплаченный пакет" value={tier} onChange={(event) => void markPaid(event.target.value as ClientTier | "")} disabled={busy}
            className="absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-full pr-12 text-base opacity-0 lg:text-sm">
            <option value="">Не заплатил(а)</option><option value="START">Клиент Start</option><option value="PRO">Клиент Pro</option><option value="VIP">Клиент ViP</option>
          </select>
          <SubjectPickerChevronIcon className="pointer-events-none size-4 shrink-0 text-neutral-500" />
        </div>
      </div>
      {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
    </div>
  );
}
