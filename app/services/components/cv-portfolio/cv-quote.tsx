"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import { heroQuote } from "./content";

export default function CvQuote() {
  const t = useTranslations();
  return <p className="mt-5 border-l-2 border-brand-300 pl-4 text-lg font-medium leading-relaxed text-brand-600">{t.content(heroQuote)}</p>;
}
