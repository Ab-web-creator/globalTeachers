import type { PanelProps } from "./content";

export default function EducatorCard({ openPanel }: PanelProps) {
  return (
    <div className="group/expert relative flex min-h-52 flex-col justify-between gap-8 overflow-hidden rounded-3xl bg-brand-500 p-5 text-white sm:p-7 xl:p-8">
      <svg viewBox="0 0 240 200" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" aria-hidden="true" className="pointer-events-none absolute -right-14 -bottom-8 w-60 -rotate-8 text-brand-400 opacity-60">
        <path d="m25 67 97-45 103 51-98 46L25 67Zm0 0c-15 13-15 37 0 47l100 48 102-48M125 119v43M35 79c-8 9-7 20 0 26l81 39M27 122l-8 19 105 49 106-49M19 141l8 19 98 46 102-47M39 131l86 41 90-41M41 148l82 39 91-40" />
      </svg>
      <h2 className="relative max-w-72 text-lg leading-tight font-medium tracking-tight sm:text-xl">Получите пошаговые рекомендации от нашего эксперта</h2>
      <button
        type="button"
        onClick={() => openPanel("Consultation")}
        className="relative mt-auto flex items-center justify-between gap-2 rounded-2xl bg-brand-400/25 px-4 py-3 text-left text-sm font-medium text-brand-50 transition-colors group-hover/expert:bg-brand-50 group-hover/expert:text-brand-500 group-focus-within/expert:bg-brand-50 group-focus-within/expert:text-brand-500"
      >
        Что входит в консультацию?
        <span aria-hidden="true" className="shrink-0 text-xl">→</span>
      </button>
    </div>
  );
}
