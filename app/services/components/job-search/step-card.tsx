const icons = {
  target: "M21 12a9 9 0 1 1-6-8.5 M17 12a5 5 0 1 1-3.5-4.8 M12 12l8-8 M17 4h3v3",
  map: "M3 6l5-2 6 2 5-2v8 M3 6v14l5-2 6 2 2-.8 M8 4v14 M14 6v5 M22 15c0 3-4 6-4 6s-4-3-4-6a4 4 0 0 1 8 0Z M19 15h-2",
  document: "M6 3h9l4 4v6 M14 3v5h5 M6 3v18h7 M9 11h7 M9 15h4 M15 19l2 2 4-4",
  laptop: "M5 5h14v10H5z M2 19h20 M4 15l-2 4 M20 15l2 4",
  bell: "M6 16V11a6 6 0 0 1 12 0v5l2 2H4l2-2Z M10 21h4 M18 4l2-2 M21 7h2",
} as const;

export const stepAccents = [
  { icon: "target", badge: "bg-violet-100 text-violet-600", circle: "bg-violet-50 text-violet-600", bar: "border-violet-200" },
  { icon: "map", badge: "bg-sky-100 text-sky-600", circle: "bg-sky-50 text-sky-600", bar: "border-sky-200" },
  { icon: "document", badge: "bg-emerald-100 text-emerald-600", circle: "bg-emerald-50 text-emerald-600", bar: "border-emerald-200" },
  { icon: "laptop", badge: "bg-amber-100 text-amber-600", circle: "bg-amber-50 text-amber-500", bar: "border-amber-200" },
  { icon: "bell", badge: "bg-pink-100 text-pink-600", circle: "bg-pink-50 text-pink-600", bar: "border-pink-200" },
] as const;

type Accent = (typeof stepAccents)[number];

export default function StepCard({ number, title, text, accent }: { number: number; title: string; text: string; accent: Accent }) {
  return (
    <div className="relative flex h-full gap-4 overflow-hidden rounded-3xl bg-white p-5 pb-7 shadow-lg shadow-neutral-200/60 ring-1 ring-neutral-100 sm:flex-col sm:gap-0">
      <div className="flex shrink-0 items-start gap-3">
        <span className={`flex size-10 shrink-0 items-center justify-center rounded-full text-lg font-bold sm:bg-neutral-100 sm:text-neutral-500 ${accent.badge}`}>{number}</span>
        <span className={`hidden size-20 items-center justify-center rounded-full sm:flex ${accent.circle}`}>
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="size-10">
            <path d={icons[accent.icon]} />
          </svg>
        </span>
      </div>
      <div className="min-w-0 sm:mt-5">
        <p className="text-base font-bold leading-snug text-neutral-900">{title}</p>
        <p className="mt-3 text-sm leading-relaxed text-neutral-500">{text}</p>
      </div>
      <span aria-hidden="true" className={`pointer-events-none absolute inset-0 rounded-3xl border-b-6 sm:border-t-6 ${accent.bar}`} />
    </div>
  );
}

export function StepConnector() {
  return (
    <span aria-hidden="true" className="hidden items-center lg:flex">
      <span className="flex size-9 items-center justify-center rounded-full bg-sky-500 text-white shadow-md shadow-sky-200">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-5">
          <path d="M5 12h14 M13 6l6 6-6 6" />
        </svg>
      </span>
    </span>
  );
}
