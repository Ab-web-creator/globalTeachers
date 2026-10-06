export default function QuestionCard({ lead, question }: { lead: string; question: string }) {
  return (
    <div className="relative flex h-full flex-col items-start overflow-hidden rounded-3xl border border-brand-200 bg-linear-to-br from-white via-violet-50 to-sky-50 p-6 sm:p-8">
      <span aria-hidden="true" className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-white text-brand-500 shadow-sm ring-1 ring-brand-100">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="size-6">
          <path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 4m0 3h.01" />
          <path d="M21 11.5a9 9 0 0 1-9 9H4l-2 2v-11a9.5 9.5 0 0 1 19 0Z" />
        </svg>
      </span>
      <p className="max-w-sm text-base leading-relaxed text-neutral-600">{lead}</p>
      <p className="mt-5 max-w-sm text-2xl font-semibold leading-snug tracking-tight text-brand-500">{question}</p>
      <span aria-hidden="true" className="mt-7 h-1 w-12 rounded-full bg-brand-300" />
    </div>
  );
}
