import { ConsultationBenefitIcon } from "@/app/components/svg";
import ProgramSection from "../../programs/components/program-section";

const benefits = [
  {
    icon: "profile",
    title: "Анализ профессионального профиля",
    description: "Оценка образования, квалификации, педагогического опыта и сильных сторон.",
  },
  {
    icon: "globe",
    title: "Перспективы международной карьеры",
    description: "Обсуждение подходящих стран, школ и возможных направлений поиска.",
  },
  {
    icon: "checklist",
    title: "Рекомендации и план действий",
    description: "Разбор необходимых документов, требований и следующих шагов.",
  },
  {
    icon: "partnership",
    title: "Обсуждение VIP-сопровождения",
    description: "Определение объёма помощи, сроков и возможных условий сотрудничества.",
  },
] as const;

export default function VipConsultationBenefitsSection() {
  return (
    <ProgramSection id="vip-consultation-benefits" label="Ваша консультация" title="Что вы получите">
      <ul className="mt-10 space-y-8">
        {benefits.map(({ icon, title, description }) => (
          <li key={title} className="flex items-start gap-4 sm:gap-6">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-500">
              <ConsultationBenefitIcon kind={icon} className="size-5" />
            </span>
            <div>
              <h3 className="text-xl font-semibold leading-snug text-brand-950">{title}</h3>
              <p className="mt-3 max-w-3xl text-base leading-relaxed text-neutral-600 sm:text-lg">{description}</p>
            </div>
          </li>
        ))}
      </ul>
    </ProgramSection>
  );
}
