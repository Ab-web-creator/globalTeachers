export default function AboutGuidanceCard() {
  return (
    <div data-reveal className="relative isolate flex flex-1 flex-col justify-between gap-6 overflow-hidden rounded-2xl bg-linear-to-br from-brand-500 to-brand-600 p-4 text-white sm:gap-10 sm:rounded-3xl sm:p-6">
      <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="1.5" className="pointer-events-none absolute -right-6 -bottom-5 -z-10 size-36 rotate-12 text-white/15 sm:size-48" aria-hidden="true">
        <path d="m10 42 50-24 50 24-50 24-50-24Zm18 10v30c18 14 46 14 64 0V52M110 42v38M15 100c18-8 32-8 45 0 13-8 27-8 45 0M15 108c18-8 32-8 45 0 13-8 27-8 45 0" />
      </svg>
      <p className="text-base font-medium leading-snug sm:text-xl">Поддержка на пути к международной карьере</p>
      <p className="text-xs leading-relaxed text-white/90 sm:text-sm">Практические рекомендации и индивидуальный план с учётом вашего опыта и целей.</p>
    </div>
  );
}
