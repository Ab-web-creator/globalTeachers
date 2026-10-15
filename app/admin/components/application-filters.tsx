"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ApplicationFilter } from "../../../lib/admin/applications";
import { SearchIcon } from "@/app/components/svg";

const statuses = [
  { value: "not-enough-english", label: "Недостаточный уровень английского" },
  { value: "not-enough-education", label: "Недостаточное образование" },
  { value: "unsupported_subjects", label: "Неподходящие предметы" },
  { value: "all", label: "Все заявки" },
  { value: "draft", label: "Незавершённые" },
  { value: "pending", label: "Неподтверждённые" },
  { value: "confirmed", label: "Полученные" },
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
      setStatus(next === "not-enough-english" || next === "not-enough-education" || next === "unsupported_subjects" || next === "draft" || next === "pending" || next === "confirmed" ? next : "all");
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
      <div className="relative min-w-0 lg:col-start-2 lg:row-start-1 lg:w-80">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-neutral-400" />
        <input id="application-search" type="search" name="q" aria-label="Поиск по всем полям" placeholder="Поиск по всем полям" value={query} onChange={(event) => { setQuery(event.target.value); update(event.target.value, status, 250); }} maxLength={200} className="block w-full min-w-0 rounded-xl border border-brand-200 bg-white py-3 pr-4 pl-11 text-base" />
      </div>
      <fieldset className="flex flex-wrap gap-2 border-t border-brand-100 pt-4 text-base lg:col-span-2 lg:col-start-1 lg:row-start-2">
        <legend className="sr-only">Статус заявки</legend>
        {statuses.map((option) => (
          <label key={option.value} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-base font-medium transition focus-within:outline-2 focus-within:outline-brand-500 ${status === option.value ? "border-brand-200 bg-brand-100 text-brand-600" : "border-transparent text-neutral-500 hover:bg-brand-50"}`}>
            <input type="radio" name="status" value={option.value} checked={status === option.value} onChange={() => { setStatus(option.value); update(query, option.value); }} className="sr-only" />
            {option.label}
          </label>
        ))}
      </fieldset>
    </form>
  );
}
