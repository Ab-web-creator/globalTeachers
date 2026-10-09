import { ResearchIdeaIcon } from "@/app/components/svg";

export default function ResearchTip({ children, label = "Совет:" }: { children: string; label?: string | null; }) {
  return (
    <aside className="flex items-center gap-3 rounded-3xl bg-violet-50 p-5 sm:gap-5 sm:p-6">
      <span aria-hidden="true" className="flex size-14 shrink-0 items-center justify-center rounded-full bg-violet-100 text-brand-500 sm:size-16">
        <ResearchIdeaIcon />
      </span>
      <p className="text-base leading-relaxed text-neutral-600 sm:text-lg">{label && <><strong className="font-semibold text-brand-950">{label}</strong> </>}{children}</p>
    </aside>
  );
}
