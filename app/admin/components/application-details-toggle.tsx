"use client";

import { ApplicationDetailsChevronIcon } from "@/app/components/svg";
import { useId, useState, type ReactNode } from "react";

type Props = { name: string; email: string; badge: ReactNode; actions: ReactNode; overview: ReactNode; children: ReactNode; };

export default function ApplicationDetailsToggle({ name, email, badge, actions, overview, children }: Props) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();

  return (
    <>
      <div className="flex items-start gap-2">
        <button type="button" aria-expanded={expanded} aria-controls={id} onClick={() => setExpanded(!expanded)} className="group min-w-0 flex-1 rounded-lg text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500">
          <span className="flex min-w-0 flex-1 flex-col gap-1 text-sm">
            <span className="flex flex-wrap items-center gap-2">
              <span className="min-w-0 break-words text-base font-semibold text-brand-700 group-hover:text-brand-600">{name}</span>
              {badge}
            </span>
            <span className="min-w-0 break-all text-neutral-700">{email}</span>
          </span>
        </button>
        <div className="flex shrink-0 items-start gap-1">{actions}</div>
        <button type="button" aria-label={`${expanded ? "Скрыть" : "Показать"} подробности: ${name}`} aria-expanded={expanded} aria-controls={id} onClick={() => setExpanded(!expanded)} className="flex size-10 shrink-0 items-center justify-center rounded-xl text-brand-500 hover:bg-brand-50">
          <ApplicationDetailsChevronIcon className={`size-5 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      </div>
      {overview}
      <div id={id} hidden={!expanded} className="mt-5 border-t border-brand-100 pt-5">{children}</div>
    </>
  );
}
