import { StrokeIcon, supportCalendarIconPath, SupportFlightIllustration } from "@/app/components/svg";

// A highlighted card led by one big figure, e.g. a support period.
export default function StatCard({ value, label }: { value: string; label: string; }) {
  return (
    <div className="relative isolate flex h-full flex-col justify-center overflow-hidden rounded-3xl border border-brand-300/20 bg-linear-to-br from-brand-300/10 to-brand-300/20 p-6 transition-colors hover:border-brand-300/60 sm:p-8">
      <div className="relative z-10 text-center">
        <div className="flex items-center justify-center gap-2">
          <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center text-brand-600 sm:size-16">
            <StrokeIcon path={supportCalendarIconPath} className="size-8 sm:size-12" />
          </span>
          <p className="text-3xl whitespace-nowrap font-semibold tracking-tight text-brand-500 sm:whitespace-normal sm:text-6xl">{value}</p>
          <span aria-hidden="true" className="w-10 shrink-0 sm:w-16" />
        </div>
        <p className="mt-2 text-lg font-semibold text-brand-950">{label}</p>
      </div>
      <div aria-hidden="true" className="relative z-10 mx-auto mt-6 h-0.5 w-12 bg-brand-400" />
      <p className="relative z-10 mt-5 text-center text-xs font-semibold tracking-widest text-brand-400">ВЫ НЕ ОДНИ В ЭТОМ ПРОЦЕССЕ</p>
      <SupportFlightIllustration />
    </div>
  );
}
