"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n/use-language";

export default function LanguageDocument() {
  const { language } = useLanguage();
  const pathname = usePathname();
  useEffect(() => {
    document.documentElement.lang = pathname?.startsWith("/admin") ? "ru" : language;
  }, [language, pathname]);
  return null;
}
