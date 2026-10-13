import type { ReactNode } from "react";

export default function AdminStat({
  label,
  value,
  note,
  featured = false,
}: {
  label: string;
  value: ReactNode;
  note: string;
  featured?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 sm:p-6 ${featured ? "border-brand-500 bg-brand-500 text-white shadow-lg shadow-brand-500/10" : "border-brand-100 bg-white"}`}
    >
      <p
        className={`text-lg font-medium ${featured ? "text-white/80" : "text-neutral-500"}`}
      >
        {label}
      </p>
      <p className="mt-3 text-4xl font-semibold tracking-tight tabular-nums">
        {value}
      </p>
      <p
        className={`mt-3 text-base leading-relaxed ${featured ? "text-white/70" : "text-neutral-400"}`}
      >
        {note}
      </p>
    </div>
  );
}
