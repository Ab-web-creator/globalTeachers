import type { questionIcons } from "./question-icons";

export default function QuestionRow({ icon, children }: { icon: (typeof questionIcons)[number]; children: string }) {
  return (
    <li className="flex items-center gap-4 rounded-2xl border border-brand-100 bg-white/70 px-3 py-1.5 sm:px-4">
      <span aria-hidden="true" className={`flex size-9 shrink-0 items-center justify-center rounded-full ${icon.tone}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-5">
          <path d={icon.path} />
        </svg>
      </span>
      <span className="leading-snug text-neutral-700">{children}</span>
    </li>
  );
}
