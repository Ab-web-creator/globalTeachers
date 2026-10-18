"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import { Caveat } from "next/font/google";

const caveat = Caveat({ subsets: ["cyrillic"], weight: "500", preload: false });

const tones = {
  weak: "bg-rose-200 rotate-3",
  strong: "bg-emerald-200 -rotate-2",
};

export default function StickyNote({ tone, children }: { tone: keyof typeof tones; children: string }) {
  const t = useTranslations();
  return <p className={`${caveat.className} w-32 shrink-0 p-4 text-2xl leading-tight text-neutral-700 shadow-md shadow-neutral-900/10 sm:w-36 ${tones[tone]}`}>{t.content(children)}</p>;
}
