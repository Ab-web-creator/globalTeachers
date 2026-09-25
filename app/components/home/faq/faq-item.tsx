type FaqItemProps = { question: string; answer: string };

export default function FaqItem({ question, answer }: FaqItemProps) {
  return (
    <details className="group rounded-2xl border border-neutral-200 bg-white transition-colors open:border-brand-500 hover:border-brand-300">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-base leading-normal font-semibold text-neutral-900 sm:px-6 sm:text-lg [&::-webkit-details-marker]:hidden">
        {question}
        <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-brand-600">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-5">
            <path d="M4 10h12" />
            <path d="M10 4v12" className="group-open:hidden" />
          </svg>
        </span>
      </summary>
      <p className="px-5 pb-5 text-base leading-relaxed text-neutral-600 sm:px-6">{answer}</p>
    </details>
  );
}
