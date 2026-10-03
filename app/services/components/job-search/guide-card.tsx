import type { ReactNode } from "react";

type GuideCardProps = {
  id: string;
  title: string;
  children: ReactNode;
};

export default function GuideCard({ id, title, children }: GuideCardProps) {
  return (
    <section aria-labelledby={id} className="h-full">
      <h3 id={id} className="text-2xl font-semibold leading-snug tracking-tight text-brand-950 sm:text-xl">{title}</h3>
      <div className="mt-7 space-y-4 text-base leading-relaxed text-brand-800">{children}</div>
    </section>
  );
}
