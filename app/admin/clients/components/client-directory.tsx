"use client";

import Link from "next/link";
import LocalTime from "../../components/local-time";
import CallClientButton from "./call-client-button";
import { SearchIcon } from "@/app/components/svg";
import { useEffect, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import type { PrivateClient } from "../../../../lib/client-area/types";

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
    document.addEventListener("visibilitychange", update);
    return () => {
      stopped = true;
      clearInterval(timer);
      window.removeEventListener("private-chat-read", update);
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
      <div className="flex items-center gap-3 overflow-x-auto rounded-xl border border-brand-100 bg-white p-2 sm:gap-5 sm:px-3">
        <nav
          className="flex shrink-0 items-center gap-2 p-1"
          aria-label="Пакет"
        >
          {["all", "START", "PRO", "VIP"].map((value) => (
            <Link
              key={value}
              href={href({ tier: value, page: "1", client: "" })}
              scroll={false}
              aria-current={tier === value ? "true" : undefined}
              className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${tier === value ? "border-brand-500 bg-brand-500 text-white" : "border-brand-200 bg-white text-neutral-600 hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700"}`}
            >
              {value === "all" ? "Все" : value}
            </Link>
          ))}
        </nav>
        <form
          action="/admin/clients"
          className="ml-auto flex min-w-64 max-w-md flex-1 items-center gap-2"
        >
          <input type="hidden" name="tier" value={tier} />
          <label htmlFor="client-search" className="sr-only">
            Найти клиента
          </label>
          <div className="relative min-w-0 flex-1">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-neutral-400" />
            <input
              key={query}
              id="client-search"
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Поиск по имени или email"
              className="w-full min-w-0 rounded-full border border-brand-100 bg-white py-2.5 pr-4 pl-10 text-base focus:-outline-offset-2"
            />
          </div>
          <button className="shrink-0 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600">
            Найти
          </button>
        </form>
      </div>
      <p className="mt-4 text-sm text-neutral-500">
        Найдено: {filtered.length} · Ожидающие ответа — выше
      </p>
      {error && (
        <p role="status" className="mt-3 text-sm text-red-700">
          Не удалось обновить список. Повторим автоматически.
        </p>
      )}
      {selected && children && (
        <article className="mt-6 rounded-3xl border border-brand-200 bg-white p-4 sm:p-6">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div className="min-w-0">
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
            <div className="flex shrink-0 flex-wrap items-start justify-end gap-2">
              <CallClientButton key={selected.id} clientId={selected.id} />
              <Link
                href={href({ client: "" })}
                scroll={false}
                aria-label={`Свернуть карточку ${selected.name}`}
                className="shrink-0 rounded-full bg-brand-50 px-4 py-2 text-sm text-brand-600 hover:bg-brand-100"
              >
                Свернуть ↑
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
            className="block w-full rounded-2xl border border-brand-100 bg-white p-5 transition-colors hover:border-brand-300 hover:bg-brand-50 sm:w-72"
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
              <span className="rounded-full bg-brand-50 px-3 py-1 font-medium text-brand-600">
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
