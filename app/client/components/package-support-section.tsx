import Link from "next/link";
import { CardChevronIcon, SupportCrownIcon } from "@/app/components/svg";
import type { ClientTier } from "../../../lib/client-area/types";

const descriptions: Record<ClientTier, string> = {
  START: "Индивидуальная консультация, оценка ваших перспектив и рекомендации для первых шагов к международной карьере.",
  PRO: "Подготовка профессиональных документов и консультационная поддержка на пути к работе в международной школе.",
  VIP: "Индивидуальная стратегия и персональное сопровождение на согласованных этапах поиска работы в международной школе.",
};

export default function PackageSupportSection({ tier }: { tier: ClientTier }) {
  return (
    <section aria-labelledby="package-support-title" className="mt-6 rounded-3xl border border-amber-100 bg-linear-to-br from-white to-amber-50/40 p-5 shadow-sm sm:p-7">
      <div className="flex items-center gap-3">
        <SupportCrownIcon className="size-6 shrink-0 text-amber-600" />
        <h2 id="package-support-title" className="font-serif text-2xl text-brand-950">Ваш уровень поддержки</h2>
      </div>
      <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row">
        <div className="flex size-28 shrink-0 items-center justify-center rounded-full bg-conic from-amber-500 via-brand-300 to-amber-100 p-1.5">
          <div className="flex size-full flex-col items-center justify-center gap-2 rounded-full bg-white">
            <span className="font-serif text-xl font-semibold text-amber-700">{tier}</span>
            <SupportCrownIcon className="size-7 text-amber-600" />
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-base font-medium leading-relaxed text-neutral-700">{descriptions[tier]}</p>
          <Link href={`/programs/${tier.toLowerCase()}`} className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-500">
            Подробнее о пакете<CardChevronIcon className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
