export default function CvSectionCard({ number, title, text, active, onActivate }: { number: number; title: string; text: string; active: boolean; onActivate: () => void }) {
  return (
    <div
      tabIndex={0}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      className={`flex items-start gap-5 rounded-3xl border bg-white p-6 transition-colors outline-none sm:p-8 ${active ? "border-brand-300 shadow-lg shadow-brand-500/10" : "border-brand-100"}`}
    >
      <span className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold tabular-nums transition-colors ${active ? "bg-brand-500 text-white" : "bg-brand-50 text-brand-600"}`}>{String(number).padStart(2, "0")}</span>
      <div className="min-w-0">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-3 max-w-lg leading-relaxed text-neutral-600">{text}</p>
      </div>
    </div>
  );
}
