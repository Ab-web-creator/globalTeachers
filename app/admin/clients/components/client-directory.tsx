"use client";

import Link from "next/link";
import LocalTime from "../../components/local-time";
import CopyClientKeyButton from "./copy-client-key-button";
import ApplicationPaymentControl from "../../components/application-payment-control";
import CallClientButton from "./call-client-button";
import { SubjectPickerChevronIcon } from "@/app/components/svg";
import { useEffect, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import type { PrivateClient } from "../../../../lib/client-area/types";

const tierBadgeColors = {
  START: "border border-blue-300 bg-blue-50 text-blue-700",
  PRO: "border border-violet-300 bg-violet-50 text-violet-700",
  VIP: "border border-amber-300 bg-amber-50 text-amber-800",
};

const tierCardColors = {
  START: "from-sky-50 via-cyan-50 to-emerald-50",
  PRO: "from-violet-50 via-pink-50 to-rose-50",
  VIP: "from-amber-50 via-orange-50 to-pink-50",
};

export default function ClientDirectory({
  initial,
  selectedId,
  children,
}: {
  initial: PrivateClient[];
  selectedId: string | null;
  children?: ReactNode;
}) {
  const params = useSearchParams();
  const query = params.get("q") ?? "";
  const tier = params.get("tier") ?? "all";
  const [clients, setClients] = useState(initial);
  const [error, setError] = useState(false);
  useEffect(() => {
    let stopped = false;
    async function refresh() {
      if (document.visibilityState !== "visible") return;
      try {
        const response = await fetch("/api/admin/clients?directory=1", {
          cache: "no-store",
        });
        if (!response.ok) throw new Error();
        const result = await response.json();
        if (!stopped) {
          setClients(result.clients);
          setError(false);
        }
      } catch {
        if (!stopped) setError(true);
      }
    }
    const update = () => {
      void refresh();
    };
    const timer = window.setInterval(update, 5000);
    window.addEventListener("private-chat-read", update);
    window.addEventListener("client-payment-changed", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      stopped = true;
      clearInterval(timer);
      window.removeEventListener("private-chat-read", update);
      window.removeEventListener("client-payment-changed", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  const normalized = query.trim().toLocaleLowerCase();
  const filtered = clients.filter(
    (client) =>
      (tier === "all" || client.tier === tier) &&
      `${client.name} ${client.email}`.toLocaleLowerCase().includes(normalized),
  );
  const pages = Math.max(1, Math.ceil(filtered.length / 25));
  const page = Math.min(
    pages,
    Math.max(1, Number.parseInt(params.get("page") ?? "1", 10) || 1),
  );
  function href(values: Record<string, string>) {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(values)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    return `/admin/clients?${next}`;
  }
  const selected = clients.find((client) => client.id === selectedId);
  const shown = filtered
    .slice((page - 1) * 25, page * 25)
    .filter((client) => client.id !== selectedId);
  return (
    <section aria-label="Клиенты" className="mt-10">
      <p className="text-sm text-neutral-500">
        Найдено: {filtered.length} · Ожидающие ответа — выше
      </p>
      {error && (
        <p role="status" className="mt-3 text-sm text-red-700">
          Не удалось обновить список. Повторим автоматически.
        </p>
      )}
      {selected && children && (
        <article className={`mt-6 rounded-3xl border border-brand-200 bg-linear-to-br p-4 sm:p-6 ${tierCardColors[selected.tier]}`}>
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1 basis-60">
              <h2 className="break-words text-xl font-semibold">
                {selected.name}
              </h2>
              <p className="mt-1 break-all text-sm text-neutral-500">
                {selected.email} · {selected.tier}
              </p>
              <p className="mt-2 text-xs text-neutral-500">
                {selected.last_seen_at ? <>Последний визит: <LocalTime value={selected.last_seen_at} /></> : "Ещё не заходил на личную страницу"}
              </p>
            </div>
            <div className="flex max-w-full flex-wrap items-start gap-2 sm:justify-end">
              <ApplicationPaymentControl key={`payment-${selected.id}-${selected.tier}-${selected.paid_at}`} clientId={selected.id} paid={Boolean(selected.paid_at)} initialTier={selected.tier} />
              {selected.paid_at && <CopyClientKeyButton key={`key-${selected.id}`} clientId={selected.id} />}
              <CallClientButton key={selected.id} clientId={selected.id} />
              <Link
                href={href({ client: "" })}
                scroll={false}
                aria-label={`Свернуть карточку ${selected.name}`}
                className="flex items-center justify-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-brand-600 transition-colors hover:bg-brand-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-300 shrink-0"
              >
                <SubjectPickerChevronIcon className="size-4 rotate-180" />
                Свернуть
              </Link>
            </div>
          </div>
          {children}
        </article>
      )}
      <div className="mt-6 flex flex-wrap items-start gap-4">
        {!filtered.length && (
          <p className="rounded-2xl bg-white p-5 text-sm text-neutral-500">
            {clients.length
              ? "Клиенты не найдены."
              : "Личные страницы ещё не созданы."}
          </p>
        )}
        {shown.map((client) => (
          <Link
            key={client.id}
            href={href({ client: client.id })}
            scroll={false}
            aria-label={`Открыть карточку ${client.name}`}
            className={`block w-full rounded-2xl border border-brand-100 bg-linear-to-br p-5 transition-colors hover:border-brand-300 sm:w-72 ${tierCardColors[client.tier]}`}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="min-w-0 break-words font-semibold">{client.name}</p>
              {!!client.unread_count && (
                <span
                  aria-label={`Непрочитанных сообщений: ${client.unread_count}`}
                  className="flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-brand-500 px-1.5 text-xs font-semibold text-white"
                >
                  {client.unread_count}
                </span>
              )}
            </div>
            <p className="mt-1 break-all text-sm text-neutral-500">
              {client.email}
            </p>
            <p className="mt-2 text-xs text-neutral-500">
              {client.last_seen_at ? <>Последний визит: <LocalTime value={client.last_seen_at} /></> : "Ещё не заходил на личную страницу"}
            </p>
            <div className="mt-4 flex items-center justify-between gap-3 text-sm">
              <span className={`inline-flex items-center rounded-full px-3 pt-1 pb-0.5 leading-5 font-medium ${tierBadgeColors[client.tier]}`}>
                {client.tier}
              </span>
              <span className="text-neutral-500">
                {client.active
                  ? `${client.booked_hours}/${client.allowance_hours} ч`
                  : "Ключ не отправлен"}
              </span>
            </div>
            {client.awaiting_reply && (
              <p className="mt-3 text-xs font-medium text-amber-700">
                Ожидает ответа
              </p>
            )}
          </Link>
        ))}
      </div>
      <nav
        aria-label="Страницы клиентов"
        className="mt-6 flex items-center justify-center gap-4 text-sm"
      >
        {page > 1 ? (
          <Link
            href={href({ page: String(page - 1) })}
            scroll={false}
            aria-label="Предыдущая страница"
            className="rounded-full bg-white px-4 py-2 hover:bg-brand-100"
          >
            ←
          </Link>
        ) : (
          <span className="px-4 text-neutral-300" aria-hidden="true">
            ←
          </span>
        )}
        <span aria-live="polite">
          {page} / {pages}
        </span>
        {page < pages ? (
          <Link
            href={href({ page: String(page + 1) })}
            scroll={false}
            aria-label="Следующая страница"
            className="rounded-full bg-white px-4 py-2 hover:bg-brand-100"
          >
            →
          </Link>
        ) : (
          <span className="px-4 text-neutral-300" aria-hidden="true">
            →
          </span>
        )}
      </nav>
    </section>
  );
}
