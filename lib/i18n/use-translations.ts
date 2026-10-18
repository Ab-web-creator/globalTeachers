"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "./use-language";
import { createTranslator } from "./translate";

export function useTranslations() {
  const { language } = useLanguage();
  const pathname = usePathname();
  const effectiveLanguage = pathname?.startsWith("/admin") ? "ru" : language;
  return useMemo(() => createTranslator(effectiveLanguage), [effectiveLanguage]);
}
