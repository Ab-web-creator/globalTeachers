import Link from "next/link";
import type { Program } from "./programs";

type ProgramCardFooterProps = { program: Program };

export default function ProgramCardFooter({ program }: ProgramCardFooterProps) {
  return (
    <div className="@container border-t border-brand-100 pt-3 pb-2 sm:mx-3">
      <div className="flex flex-col items-start gap-4 @min-[17rem]:flex-row @min-[17rem]:items-center @min-[17rem]:justify-between">
        <p className="flex min-h-14 min-w-0 items-center text-brand-500 @min-[17rem]:flex-1">
          {program.price === null ? (
            <span lang="ru" className="max-w-[25ch] text-base lg:text-xs leading-snug font-medium hyphens-manual">Стоимость рассчиты&shy;ва&shy;ется индивидуально</span>
          ) : (
            <span className="flex flex-col">
              <span className="text-3xl font-semibold tracking-tight">${program.price}</span>
              <span className="text-base lg:text-xs leading-normal text-neutral-600">единоразовая</span>
            </span>
          )}
        </p>
        <Link href={`/programs/${program.tier.toLowerCase()}`} className="shrink-0 rounded-2xl sm:rounded-full bg-linear-to-r from-blue-100 to-violet-200 px-5 py-2.5 sm:py-3 text-base lg:text-sm font-medium whitespace-nowrap text-brand-700 transition hover:from-blue-200 hover:to-violet-300 hover:shadow-md" aria-label={`Подробнее о программе ${program.tier}`}>
          Подробнее
        </Link>
      </div>
    </div>
  );
}
