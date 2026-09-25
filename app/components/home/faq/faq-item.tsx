import FaqIcon, { type FaqIconName } from "./faq-icon";

type FaqItemProps = { question: string; answer: string; icon: FaqIconName };

export default function FaqItem({ question, answer, icon }: FaqItemProps) {
  return (
    <details className="group rounded-2xl border border-neutral-200 bg-white transition-colors open:border-brand-500 hover:border-brand-300">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5 text-base leading-normal font-semibold text-neutral-900 sm:px-6 sm:text-lg [&::-webkit-details-marker]:hidden">
        <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center text-brand-500">
          <FaqIcon name={icon} />
        </span>
        <span className="min-w-0 flex-1">{question}</span>
        <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center text-brand-600">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-5">
            <path d="M4 10h12" />
            <path d="M10 4v12" className="group-open:hidden" />
          </svg>
        </span>
      </summary>
      <p className="pr-5 pb-5 pl-17 text-base leading-relaxed text-neutral-600 sm:pr-6 sm:pl-18">{answer}</p>
    </details>
  );
}
