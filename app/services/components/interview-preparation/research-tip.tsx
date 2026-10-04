export default function ResearchTip({ children }: { children: string }) {
  return (
    <aside className="flex items-center gap-5 rounded-3xl bg-violet-50 p-5 sm:gap-8 sm:p-6">
      <span aria-hidden="true" className="flex size-14 shrink-0 items-center justify-center rounded-full bg-violet-100 text-brand-500 sm:size-16">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-7 sm:size-8">
          <path d="M9 18h6m-5 3h4M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 4H9c0-2 0-3-1-4ZM2 8H1m22 0h-1M5 2 4 1m15 1 1-1" />
        </svg>
      </span>
      <p className="text-sm leading-relaxed text-neutral-600 sm:text-base"><strong className="font-semibold text-brand-950">Совет:</strong> {children}</p>
    </aside>
  );
}
