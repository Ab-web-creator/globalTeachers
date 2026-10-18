"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import { ConsultationBenefitIcon } from "@/app/components/svg";
import ProgramSection from "../../programs/components/program-section";

const benefits = [
  {
    icon: "profile",
    background: "from-violet-50 to-white",
    iconColor: "bg-violet-100 text-violet-600",
    title: "Анализ профессионального профиля",
    description: "Оценка образования, квалификации, педагогического опыта и сильных сторон.",
  },
  {
    icon: "globe",
    background: "from-sky-50 to-white",
    iconColor: "bg-sky-100 text-sky-600",
    title: "Перспективы международной карьеры",
    description: "Обсуждение подходящих стран, школ и возможных направлений поиска.",
  },
  {
    icon: "checklist",
    background: "from-emerald-50 to-white",
    iconColor: "bg-emerald-100 text-emerald-600",
    title: "Рекомендации и план действий",
    description: "Разбор необходимых документов, требований и следующих шагов.",
  },
  {
    icon: "partnership",
    background: "from-amber-50 to-white",
    iconColor: "bg-amber-100 text-amber-600",
    title: "Обсуждение VIP-сопровождения",
    description: "Определение объёма помощи, сроков и возможных условий сотрудничества.",
  },
] as const;

export default function VipConsultationBenefitsSection() {
  const t = useTranslations();
  return (
    <ProgramSection id="vip-consultation-benefits" label={t("payment.vipConsultationBenefitsSection.message1105")} title={t("payment.vipConsultationBenefitsSection.message1106")}>
      <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:gap-6">
        {benefits.map(({ icon, title, description, background, iconColor }, index) => (
          <li key={title} className={`flex flex-col rounded-3xl border border-neutral-200/70 bg-linear-to-br p-5 shadow-sm sm:p-7 ${background}`}>
            <div className="mb-5 flex items-center justify-between">
              <span className={`flex size-12 items-center justify-center rounded-2xl ${iconColor}`}>
                <ConsultationBenefitIcon kind={icon} className="size-6" />
              </span>
              <span aria-hidden="true" className="text-sm font-medium tabular-nums text-neutral-400">0{index + 1}</span>
            </div>
            <h3 className="max-w-sm text-xl font-semibold leading-snug text-brand-700">{t.content(title)}</h3>
            <p className="mt-3 text-base leading-relaxed text-neutral-600">{t.content(description)}</p>
          </li>
        ))}
      </ul>
    </ProgramSection>
  );
}
