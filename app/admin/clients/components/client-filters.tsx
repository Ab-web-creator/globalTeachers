"use client";

import Link from "next/link";
import { SearchIcon } from "@/app/components/svg";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

// Package tabs and a search that filters as the admin types; the directory reads both from the URL.
export default function ClientFilters() {
  const params = useSearchParams();
  const tier = params.get("tier") ?? "all";
  const [search, setSearch] = useState(params.get("q") ?? "");
  function update(value: string) {
    setSearch(value);
    const next = new URLSearchParams(window.location.search);
    if (value.trim()) next.set("q", value.trim());
    else next.delete("q");
    next.set("page", "1");
    window.history.replaceState(null, "", `/admin/clients?${next}`);
  }
  function tierHref(value: string) {
    const next = new URLSearchParams(params.toString());
    next.set("tier", value);
    next.set("page", "1");
    next.delete("client");
    return `/admin/clients?${next}`;
  }
  return (
    <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap">
      <nav className="flex shrink-0 items-center gap-2" aria-label="Пакет">
        {["all", "START", "PRO", "VIP"].map((value) => (
          <Link
            key={value}
            href={tierHref(value)}
            scroll={false}
            aria-current={tier === value ? "true" : undefined}
            className={`rounded-xl border px-6 py-1.5 text-sm font-medium transition-colors ${tier === value ? "border-brand-500 bg-brand-500 text-white" : "border-brand-200 bg-white text-neutral-600 hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700"}`}
          >
            {{ all: "Все", START: "Start", PRO: "Pro", VIP: "ViP" }[value]}
          </Link>
        ))}
      </nav>
      <div className="relative w-full max-w-xs sm:w-80">
        <label htmlFor="client-search" className="sr-only">
          Найти клиента
        </label>
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
        <input
          id="client-search"
          type="search"
          value={search}
          onChange={(event) => update(event.target.value)}
          placeholder="Поиск по имени или email"
          className="w-full min-w-0 rounded-full border border-brand-100 bg-white py-1.5 pr-4 pl-10 text-base"
        />
      </div>
    </div>
  );
}
