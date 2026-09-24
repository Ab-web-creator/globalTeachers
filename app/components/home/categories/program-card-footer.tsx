import type { Program } from "./programs";

type ProgramCardFooterProps = { program: Program; onDetails: () => void };

export default function ProgramCardFooter({ program, onDetails }: ProgramCardFooterProps) {
  return (
    <div className="mx-3 flex flex-wrap items-center justify-between gap-4 border-t border-brand-100 pt-5 pb-3">
      <p className={`flex min-h-14 shrink-0 items-center text-brand-500 ${program.price === null ? "basis-48" : "basis-32"}`}>
        {program.price === null ? (
          <span className="text-xs leading-snug font-medium">Стоимость рассчитывается индивидуально</span>
        ) : (
          <span className="text-3xl font-semibold tracking-tight">${program.price}</span>
        )}
      </p>
      <button onClick={onDetails} className="shrink-0 rounded-full bg-brand-100 px-5 py-3 text-sm font-medium whitespace-nowrap text-brand-900 transition hover:bg-brand-200" aria-label={`Подробнее о программе ${program.tier}`}>
        Подробнее
        {/* <span aria-hidden="true">→</span> */}
      </button>
    </div>
  );
}
