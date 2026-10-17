"use client";

import Link from "next/link";
import LocalTime from "../../components/local-time";
import cardStyles from "../../components/application-card.module.css";
import { ApplicationCalendarIcon, ApplicationStarIcon, AppointmentClockIcon, BriefcaseIcon, StartClientIcon, EnvelopeIcon, SupportCrownIcon, UserProfileIcon } from "@/app/components/svg";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { PrivateClient } from "../../../../lib/client-area/types";

const tierHeaderColors = {
  START: "bg-linear-to-r from-sky-500 to-emerald-500 text-white",
  PRO: "bg-linear-to-r from-brand-500 to-violet-500 text-white",
  VIP: "bg-linear-to-r from-amber-400 to-orange-400 text-white",
};

export default function ClientDirectory({
  initial,
}: {
  initial: PrivateClient[];
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
  const shown = filtered
    .slice((page - 1) * 25, page * 25);
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
      <div className="mt-6 flex flex-wrap items-start gap-4">
        {!filtered.length && (
          <p className="rounded-2xl bg-white p-5 text-sm text-neutral-500">
            {clients.length
              ? "Клиенты не найдены."
              : "Личные страницы ещё не созданы."}
          </p>
        )}
        {shown.map((client) => (
          <ClientSummaryCard key={client.id} client={client} href={`/admin/clients/${client.id}`} />
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

function ClientSummaryCard({ client, href }: { client: PrivateClient; href: string }) {
  const paid = Boolean(client.paid_at);
  const Icon = !paid ? UserProfileIcon : client.tier === "VIP" ? SupportCrownIcon : client.tier === "PRO" ? BriefcaseIcon : StartClientIcon;
  return (
    <Link href={href} target="_blank" rel="noopener noreferrer" aria-label={`Открыть карточку ${client.name} в новой вкладке`} className="block w-full overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-md transition-shadow hover:shadow-lg focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-500 sm:w-80">
      <header className={`relative isolate flex flex-col gap-2 overflow-hidden px-4 py-3 ${paid ? tierHeaderColors[client.tier] : "bg-linear-to-r from-neutral-300 to-neutral-200 text-neutral-800"}`}>
        <span aria-hidden="true" className={`${cardStyles.ornament} ${paid ? cardStyles.paidOrnament : ""}`} />
        <div className="flex items-center gap-2">
          <Icon className="size-6 shrink-0" />
          <h2 className="min-w-0 flex-1 break-words text-base font-semibold leading-tight">{client.name}</h2>
          {!!client.unread_count && <span aria-label={`Непрочитанных сообщений: ${client.unread_count}`} className="flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-white px-1.5 text-xs font-semibold text-brand-600">{client.unread_count}</span>}
        </div>
        <span className={`inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold shadow-sm ${paid && client.tier === "VIP" ? "text-amber-700" : "text-brand-700"}`}>
          {paid && <ApplicationStarIcon className="size-4" />}
          {paid ? "Клиент" : "Кандидат"} {client.tier}
        </span>
      </header>
      <dl className="mx-4 divide-y divide-neutral-200 text-sm">
        <div className="flex items-start gap-3 py-2">
          <EnvelopeIcon className="mt-0.5 size-4 shrink-0 text-neutral-600" />
          <div className="min-w-0"><dt className="text-xs text-neutral-500">Email</dt><dd className="mt-0.5 break-all text-neutral-800">{client.email}</dd></div>
        </div>
        <div className="flex items-start gap-3 py-2">
          <ApplicationCalendarIcon className="mt-0.5 size-4 shrink-0 text-neutral-600" />
          <div className="min-w-0"><dt className="text-xs text-neutral-500">Последний визит</dt><dd className="mt-0.5 text-neutral-800">{client.last_seen_at ? <LocalTime value={client.last_seen_at} /> : "Ещё не заходил на личную страницу"}</dd></div>
        </div>
        <div className="flex items-start gap-3 py-2">
          <AppointmentClockIcon className="mt-0.5 size-4 shrink-0 text-neutral-600" />
          <div className="min-w-0"><dt className="text-xs text-neutral-500">Консультации</dt><dd className="mt-0.5 text-neutral-800">{client.active ? `Забронировано ${client.booked_hours} из ${client.allowance_hours} ч` : "Ключ не отправлен"}</dd></div>
        </div>
      </dl>
      {client.awaiting_reply && <p className="mx-4 mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">Ожидает ответа</p>}
    </Link>
  );
}
