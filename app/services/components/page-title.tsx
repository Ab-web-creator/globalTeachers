"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import type { ReactNode } from "react";

export default function PageTitle({ children }: { children: ReactNode }) {
  const t = useTranslations();
  return <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-4xl xl:text-6xl">{t.content(children)}</h1>;
}
