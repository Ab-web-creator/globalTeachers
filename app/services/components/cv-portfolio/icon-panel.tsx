import { panelIconPaths, PanelTopicIcon } from "@/app/components/svg";
import type { ReactNode } from "react";
import SectionHeading from "../section-heading";

const tones = {
  default: { panel: "border-brand-200 bg-white/60", icon: "bg-brand-100 text-brand-500" },
  white: { panel: "border-brand-200 bg-white", icon: "bg-brand-100 text-brand-500" },
  yellow: { panel: "border-amber-200 bg-linear-to-br from-yellow-50/50 to-amber-50 shadow-md shadow-amber-900/5", icon: "bg-amber-100 text-amber-700" },
  green: { panel: "border-emerald-200 bg-linear-to-br from-emerald-50 to-green-100 shadow-md shadow-emerald-900/5", icon: "bg-emerald-100 text-emerald-700" },
} as const;

type IconPanelProps = {
  id: string;
  title: string;
  icon: keyof typeof panelIconPaths;
  children: ReactNode;
  tone?: keyof typeof tones;
  as?: "section" | "div";
};

export default function IconPanel({ id, title, icon, children, tone = "default", as: Container = "section" }: IconPanelProps) {
  const colors = tones[tone];

  return (
    <Container aria-labelledby={Container === "section" ? id : undefined} className={`flex flex-col gap-5 rounded-3xl border p-6 sm:flex-row sm:gap-6 sm:p-8 ${colors.panel}`}>
      <span aria-hidden="true" className={`flex size-14 shrink-0 items-center justify-center rounded-full ${colors.icon}`}>
        <PanelTopicIcon path={panelIconPaths[icon]} />
      </span>
      <div className="min-w-0">
        {tone === "default" || tone === "white" ? (
          <SectionHeading id={id} size="small">{title}</SectionHeading>
        ) : (
          <h2 id={id} className="text-xl font-semibold leading-tight tracking-tight text-brand-950">{title}</h2>
        )}
        {children}
      </div>
    </Container>
  );
}
