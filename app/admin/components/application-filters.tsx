"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ApplicationFilter } from "../../../lib/admin/applications";

const statuses = [
  { value: "all", label: "Все заявки" },
  { value: "pending", label: "Временные" },
  { value: "confirmed", label: "Подтверждённые" },
] as const;

export default function ApplicationFilters({ filter, search }: { filter: ApplicationFilter; search: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(search);
  const [status, setStatus] = useState<ApplicationFilter>(filter);
  const [pending, startTransition] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function restoreFilters() {
      if (timer.current) clearTimeout(timer.current);
      const params = new URLSearchParams(window.location.search);
      setQuery(params.get("q") ?? "");
      const next = params.get("status");
      setStatus(next === "pending" || next === "confirmed" ? next : "all");
    }
    window.addEventListener("popstate", restoreFilters);
    return () => {
      if (timer.current) clearTimeout(timer.current);
      window.removeEventListener("popstate", restoreFilters);
    };
  }, []);

  function update(nextQuery: string, nextStatus: ApplicationFilter, delay = 0) {
    if (timer.current) clearTimeout(timer.current);
    const params = new URLSearchParams({ status: nextStatus });
    if (nextQuery.trim()) params.set("q", nextQuery.trim());
    const navigate = () => startTransition(() => router.replace(`/admin?${params}`, { scroll: false }));
    if (delay) timer.current = setTimeout(navigate, delay);
    else navigate();
  }

  return (
    <form action="/admin" method="get" aria-busy={pending} onSubmit={(event) => { event.preventDefault(); update(query, status); }} className="contents">
      <input id="application-search" type="search" name="q" aria-label="Поиск по всем полям" placeholder="Поиск по всем полям" value={query} onChange={(event) => { setQuery(event.target.value); update(event.target.value, status, 250); }} maxLength={200} className="block w-full min-w-0 rounded-xl border border-brand-200 bg-white px-4 py-3 text-sm lg:col-start-2 lg:row-start-1 lg:w-80" />
      <fieldset className="flex flex-wrap gap-x-4 gap-y-2 text-sm lg:col-span-2 lg:col-start-1 lg:row-start-2">
        <legend className="sr-only">Статус заявки</legend>
        {statuses.map((option) => (
          <label key={option.value} className="flex cursor-pointer items-center gap-2">
            <input type="radio" name="status" value={option.value} checked={status === option.value} onChange={() => { setStatus(option.value); update(query, option.value); }} className="size-4 accent-brand-500" />
            {option.label}
          </label>
        ))}
      </fieldset>
    </form>
  );
}
