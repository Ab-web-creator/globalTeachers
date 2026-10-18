import Link from "next/link";
import { CardChevronIcon, SupportCrownIcon } from "@/app/components/svg";
import type { ClientTier } from "../../../lib/client-area/types";

const descriptions: Record<ClientTier, string> = {
  START: "Индивидуальная консультация, оценка ваших перспектив и рекомендации для первых шагов к международной карьере.",
  PRO: "Подготовка профессиональных документов и консультационная поддержка на пути к работе в международной школе.",
  VIP: "Индивидуальная стратегия и персональное сопровождение на согласованных этапах поиска работы в международной школе.",
};

// The client theme remaps amber to blue, so VIP gold uses the yellow scale.
const standardStyle = {
  card: "border-amber-100 from-white to-amber-50/40",
  icon: "text-amber-600",
  ring: "from-amber-500 via-brand-300 to-amber-100",
  label: "text-amber-700",
  badge: "bg-amber-50 text-amber-700",
};
const tierStyles: Record<ClientTier, typeof standardStyle> = {
  START: standardStyle,
  PRO: standardStyle,
  VIP: {
    card: "border-yellow-300 from-yellow-50 to-white",
    icon: "text-yellow-600",
    ring: "from-yellow-500 via-yellow-200 to-yellow-600",
    label: "text-yellow-700",
    badge: "bg-linear-to-r from-yellow-300 to-yellow-500 text-yellow-950 shadow-sm",
  },
};

export default function PackageSupportSection({ tier }: { tier: ClientTier }) {
  const style = tierStyles[tier];
  return (
    <section aria-labelledby="package-support-title" className={`mt-6 rounded-3xl border bg-linear-to-br p-5 shadow-sm sm:p-7 ${style.card}`}>
      <div className="flex items-start gap-3 sm:items-center">
        <SupportCrownIcon className={`mt-1 size-6 shrink-0 sm:mt-0 ${style.icon}`} />
        <h2 id="package-support-title" className="font-serif text-2xl text-brand-950">Ваш уровень поддержки</h2>
      </div>
      {/* Phones hide the ring, so the package name moves into a badge. */}
      <span className={`mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold sm:hidden ${style.badge}`}>
        <SupportCrownIcon className="size-4" />
        Пакет {tier}
      </span>
      <div className="mt-6 flex items-center gap-4 sm:gap-6">
        <div className={`hidden size-28 shrink-0 items-center justify-center rounded-full bg-conic p-1.5 sm:flex ${style.ring}`}>
          <div className="flex size-full flex-col items-center justify-center gap-2 rounded-full bg-white">
            <span className={`font-serif text-xl font-semibold ${style.label}`}>{tier}</span>
            <SupportCrownIcon className={`size-7 ${style.icon}`} />
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-base leading-relaxed text-neutral-700">{descriptions[tier]}</p>
          <Link href={`/programs/${tier.toLowerCase()}`} className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-500">
            Подробнее о пакете<CardChevronIcon className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
