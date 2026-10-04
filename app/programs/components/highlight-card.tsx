import type { ReactNode } from "react";

// Card frame for highlighted facts: transparent on phones, violet gradient from sm.
export default function HighlightCard({ children }: { children: ReactNode }) {
  return <div className="flex h-full flex-col justify-center rounded-3xl p-6 sm:bg-linear-to-br sm:from-brand-50 sm:to-violet-100 sm:p-8">{children}</div>;
}
