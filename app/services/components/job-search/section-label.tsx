"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import type { ReactNode } from "react";

export default function SectionLabel({ children, light = false }: { children: ReactNode; light?: boolean }) {
  const t = useTranslations();
  return (
    <p className={`mb-4 text-sm font-semibold tracking-wide uppercase ${light ? "text-white" : "text-brand-500"}`}>
      {t.content(children)}
    </p>
  );
}
