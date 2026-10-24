"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import { StrokeIcon } from "@/app/components/svg";
import FlowChips from "./flow-chips";
import type { ReactNode } from "react";

// Keep the description aligned with the heading beside the icon at every screen size.
export default function IconCard({ icon, iconGraphic, title, paragraphs, tone, surface, compact = false }: { icon: string; iconGraphic?: ReactNode; title: string; paragraphs: string[]; tone?: string; surface?: string; compact?: boolean; }) {
  const t = useTranslations();
  return (
    <li className={`group grid grid-cols-[auto_1fr] content-start items-center gap-x-4 gap-y-3 rounded-3xl border transition-colors hover:shadow-lg hover:shadow-brand-500/10 sm:items-start sm:gap-x-5 ${compact ? "p-3 sm:p-5" : "p-4 sm:p-8"} ${surface ?? "border-brand-100 bg-white hover:border-brand-300"}`}>
      <span aria-hidden="true" className={`flex shrink-0 items-center justify-center rounded-full row-span-2 self-start ${compact ? "size-10" : "size-12"} ${tone ?? "bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white"}`}>
        {iconGraphic ?? <StrokeIcon path={icon} className={compact ? "size-5" : "size-6"} />}
      </span>
      <h3 className="min-w-0 text-base font-semibold leading-relaxed">{t.content(title)}</h3>
      <div className="col-start-2 min-w-0 space-y-3">
        {paragraphs.map((text) => t.content(text).includes("→")
          ? <FlowChips key={text} text={text} />
          : <p key={text} className="leading-relaxed text-neutral-600">{t.content(text)}</p>)}
      </div>
    </li>
  );
}
