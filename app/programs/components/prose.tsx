"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
// Section body copy: regular paragraphs, plus an optional purple closing line.
export default function Prose({ paragraphs, closing }: { paragraphs: readonly string[]; closing?: string }) {
  const t = useTranslations();
  return (
    <>
      {paragraphs.map((text, index) => <p key={text} className={`${index === 0 ? "mt-7" : "mt-4"} text-lg leading-relaxed text-neutral-600`}>{t.content(text)}</p>)}
      {t.content(closing && <p className="mt-6 text-lg leading-relaxed text-brand-600">{t.content(closing)}</p>)}
    </>
  );
}
