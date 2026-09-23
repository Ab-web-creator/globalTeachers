import type { Program } from "./programs";

type ProgramCardFooterProps = { program: Program; onDetails: () => void };

export default function ProgramCardFooter({ program, onDetails }: ProgramCardFooterProps) {
  return (
    <div className="mx-3 flex flex-col items-center gap-4 border-t border-brand-100 pt-5 pb-3">
      <p className="flex min-h-14 items-center justify-center text-center text-brand-500">
        {program.price === null ? (
          <span className="max-w-64 text-base leading-snug font-medium">Стоимость рассчитывается индивидуально</span>
        ) : (
          <span className="text-3xl font-semibold tracking-tight">${program.price}</span>
        )}
      </p>
      <button onClick={onDetails} className="mt-auto rounded-full bg-brand-100 px-10 py-3 text-sm font-medium text-brand-500 transition hover:bg-brand-200" aria-label={`Подробнее о программе ${program.tier}`}>
        Подробнее <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}
