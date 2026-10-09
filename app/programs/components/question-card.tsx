import { ProgramQuestionIcon } from "@/app/components/svg";

export default function QuestionCard({ lead, question }: { lead: string; question: string; }) {
  return (
    <div className="relative flex h-full flex-col items-start overflow-hidden rounded-3xl border border-brand-200 bg-linear-to-br from-white via-violet-50 to-sky-50 p-6 sm:p-8">
      <span aria-hidden="true" className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-white text-brand-500 shadow-sm ring-1 ring-brand-100">
        <ProgramQuestionIcon />
      </span>
      <p className="max-w-sm text-base leading-relaxed text-neutral-600">{lead}</p>
      <p className="mt-5 max-w-sm border-l-2 border-brand-300 pl-4 text-lg font-medium leading-relaxed text-brand-600">{question}</p>
    </div>
  );
}
