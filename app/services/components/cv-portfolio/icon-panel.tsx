import type { ReactNode } from "react";
import SectionHeading from "../section-heading";

const icons = {
  checklist: "M9 4h6v3H9z M9 5H6v16h12V5h-3 M9 12l2 2 4-4 M9 17h6",
  gem: "M6 3h12l4 6-10 12L2 9l4-6Z M2 9h20 M9 3l3 6 3-6 M12 9v12",
} as const;

type IconPanelProps = {
  id: string;
  title: string;
  icon: keyof typeof icons;
  children: ReactNode;
};

export default function IconPanel({ id, title, icon, children }: IconPanelProps) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-5 rounded-3xl border border-brand-200 bg-white/60 p-6 sm:flex-row sm:gap-6 sm:p-8">
      <span aria-hidden="true" className="flex size-14 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-500">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-7">
          <path d={icons[icon]} />
        </svg>
      </span>
      <div className="min-w-0">
        <SectionHeading id={id} size="small">{title}</SectionHeading>
        {children}
      </div>
    </section>
  );
}
