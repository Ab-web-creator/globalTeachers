import type { ReactNode } from "react";
import SectionLabel from "./section-label";

type GuideCardProps = {
  id: string;
  label: string;
  title: string;
  children: ReactNode;
};

export default function GuideCard({ id, label, title, children }: GuideCardProps) {
  return (
    <section aria-labelledby={id} className="h-full rounded-3xl border border-brand-100 bg-white px-7 py-9 shadow-lg sm:p-10">
      <SectionLabel>{label}</SectionLabel>
      <div aria-hidden="true" className="mt-5 mb-7 h-0.5 w-16 bg-amber-400" />
      <h2 id={id} className="text-2xl font-semibold leading-snug tracking-tight text-brand-950 sm:text-xl">{title}</h2>
      <div className="mt-7 space-y-7 text-base leading-relaxed text-brand-800">{children}</div>
    </section>
  );
}
