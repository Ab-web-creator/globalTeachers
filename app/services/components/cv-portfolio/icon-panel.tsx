import type { ReactNode } from "react";
import SectionHeading from "../section-heading";

const icons = {
  checklist: "M9 4h6v3H9z M9 5H6v16h12V5h-3 M9 12l2 2 4-4 M9 17h6",
  gem: "M6 3h12l4 6-10 12L2 9l4-6Z M2 9h20 M9 3l3 6 3-6 M12 9v12",
  info: "M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18 M12 11v5 M12 8h.01",
  handshake: "M2 11l4-4 4 2 3-2 4 1 5 3 M2 11l6 6 2-1 2 2 2-1 2 1 4-4 M10 9l-3 3 2 2 4-4",
} as const;

const tones = {
  default: { panel: "border-brand-200 bg-white/60", icon: "bg-brand-100 text-brand-500" },
  yellow: { panel: "border-amber-200 bg-linear-to-br from-yellow-50/50 to-amber-50 shadow-md shadow-amber-900/5", icon: "bg-amber-100 text-amber-700" },
  green: { panel: "border-emerald-200 bg-linear-to-br from-emerald-50 to-green-100 shadow-md shadow-emerald-900/5", icon: "bg-emerald-100 text-emerald-700" },
} as const;

type IconPanelProps = {
  id: string;
  title: string;
  icon: keyof typeof icons;
  children: ReactNode;
  tone?: keyof typeof tones;
  as?: "section" | "div";
};

export default function IconPanel({ id, title, icon, children, tone = "default", as: Container = "section" }: IconPanelProps) {
  const colors = tones[tone];

  return (
    <Container aria-labelledby={Container === "section" ? id : undefined} className={`flex flex-col gap-5 rounded-3xl border p-6 sm:flex-row sm:gap-6 sm:p-8 ${colors.panel}`}>
      <span aria-hidden="true" className={`flex size-14 shrink-0 items-center justify-center rounded-full ${colors.icon}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-7">
          <path d={icons[icon]} />
        </svg>
      </span>
      <div className="min-w-0">
        {tone === "default" ? (
          <SectionHeading id={id} size="small">{title}</SectionHeading>
        ) : (
          <h2 id={id} className="text-xl font-semibold leading-tight tracking-tight text-brand-950">{title}</h2>
        )}
        {children}
      </div>
    </Container>
  );
}
