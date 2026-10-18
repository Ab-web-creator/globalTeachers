"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import type { ReactNode } from "react";

export default function AnswerExample({ label = "Пример ответа", className = "w-fit", children }: { label?: string; className?: string; children: ReactNode }) {
  const t = useTranslations();
  return (
    <figure className={`${className} max-w-full rounded-2xl bg-neutral-100/80 px-5 py-4 sm:px-6`}>
      <figcaption className="text-xs font-semibold uppercase tracking-wider text-neutral-400">{t.content(label)}</figcaption>
      <blockquote className="mt-2 text-lg leading-relaxed text-neutral-700">{t.content(children)}</blockquote>
    </figure>
  );
}
