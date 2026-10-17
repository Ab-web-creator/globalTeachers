"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { ApplicationFilter } from "../../../lib/admin/applications";
import { SearchIcon } from "@/app/components/svg";

const statuses = [
  { value: "not-enough-english", label: "Английский не на уровне" },
  { value: "not-enough-education", label: "Образование не то" },
  { value: "unsupported_subjects", label: "Предметы не те" },
  { value: "all", label: "Все заявки" },
  { value: "payment", label: "Кандидаты" },
  { value: "paid", label: "Оплаченные клиенты" },
  { value: "draft", label: "Незавершённые" },
  { value: "pending", label: "Неподтверждённые" },
  { value: "confirmed", label: "Полученные" },
] as const;

export default function ApplicationFilters({
  filter,
  search,
}: {
  filter: ApplicationFilter;
  search: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(search);
  const [status, setStatus] = useState<ApplicationFilter>(filter);
  const [pending, startTransition] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const filterStrip = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const strip = filterStrip.current;
    if (!strip) return;
    function scrollFilters(event: WheelEvent) {
      if (!strip || event.ctrlKey || strip.scrollWidth <= strip.clientWidth) return;
      if (Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;
      const distance = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? strip.clientWidth : 1);
      event.preventDefault();
      strip.scrollLeft += distance;
    }
    strip.addEventListener("wheel", scrollFilters, { passive: false });
    return () => strip.removeEventListener("wheel", scrollFilters);
  }, []);

  useEffect(() => {
    function restoreFilters() {
      if (timer.current) clearTimeout(timer.current);
      const params = new URLSearchParams(window.location.search);
      setQuery(params.get("q") ?? "");
      const next = params.get("status");
      setStatus(
        next === "not-enough-english" ||
          next === "not-enough-education" ||
          next === "unsupported_subjects" ||
          next === "payment" ||
          next === "paid" ||
          next === "draft" ||
          next === "pending" ||
          next === "confirmed"
          ? next
          : "all",
      );
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
    const navigate = () =>
      startTransition(() =>
        router.replace(`/admin?${params}`, { scroll: false }),
      );
    if (delay) timer.current = setTimeout(navigate, delay);
    else navigate();
  }

  return (
    <form
      action="/admin"
      method="get"
      aria-busy={pending}
      onSubmit={(event) => {
        event.preventDefault();
        update(query, status);
      }}
      className="contents"
    >
      <div className="flex min-w-0 flex-wrap items-center gap-3 lg:col-start-2 lg:row-start-1">
        <Link
          href="/admin/analytics"
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-full border border-brand-200 bg-white px-4 py-2 text-base font-medium text-neutral-600 transition-colors hover:bg-brand-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-500"
        >
          Посещаемость
        </Link>
        <div className="relative min-w-0 flex-1 lg:w-80">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-neutral-400" />
        <input
          id="application-search"
          type="search"
          name="q"
          aria-label="Поиск по всем полям"
          placeholder="Поиск по всем полям"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            update(event.target.value, status, 250);
          }}
          maxLength={200}
          className="block h-10 w-full min-w-0 rounded-full border border-brand-200 bg-white py-2 pr-4 pl-11 text-base text-neutral-600 placeholder:text-neutral-500"
        />
        </div>
      </div>
      <div className="-mx-5 min-w-0 overflow-hidden sm:-mx-6 lg:col-span-2 lg:col-start-1 lg:row-start-2">
      <div ref={filterStrip} role="radiogroup" aria-label="Статус заявки" tabIndex={0} className="relative flex w-full min-w-0 max-w-full gap-2 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-0 bg-neutral-400 p-2 text-base focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-neutral-500">
        {statuses.map((option) => (
          <label
            key={option.value}
            className={`flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-lg border px-3 py-2 text-sm font-medium transition has-focus-visible:outline-2 has-focus-visible:-outline-offset-2 has-focus-visible:outline-neutral-500 ${status === option.value ? "border-neutral-500 bg-neutral-600 text-white" : "border-neutral-300 bg-neutral-200 text-neutral-700 hover:border-white hover:bg-white"}`}
          >
            <input
              type="radio"
              name="status"
              value={option.value}
              checked={status === option.value}
              onChange={() => {
                setStatus(option.value);
                update(query, option.value);
              }}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
      </div>
    </form>
  );
}
