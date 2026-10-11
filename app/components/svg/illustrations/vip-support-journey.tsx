import type { SVGProps } from "react";
import { programIconPaths } from "../data/program-icon-paths";

const stages = [
  { label: "Стратегия", detail: "Определяем направление поиска", icon: "compass" },
  { label: "Документы", detail: "Готовим профессиональную заявку", icon: "document" },
  { label: "Вакансии и заявки", detail: "Выбираем подходящие возможности", icon: "search" },
  { label: "Интервью", detail: "Готовимся уверенно представить опыт", icon: "chat" },
  { label: "Предложение", detail: "Вместе оцениваем условия школы", icon: "school" },
] as const;

export function VipSupportJourneyIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 440 460" fill="none" aria-hidden="true" {...props}>
      <rect x="1" y="1" width="438" height="458" rx="24" className="fill-white stroke-brand-100" />
      <text x="32" y="42" className="fill-brand-600" fontSize="12" fontWeight="600" letterSpacing="1.5">ПОДДЕРЖКА НА КАЖДОМ ЭТАПЕ</text>
      <path d="M56 88V368" className="stroke-brand-200" strokeWidth="2" />
      {stages.map(({ label, detail, icon }, index) => (
        <g key={label} transform={`translate(0 ${index * 70})`}>
          <circle cx="56" cy="88" r="22" className={index === 4 ? "fill-brand-500" : "fill-brand-50 stroke-brand-100"} />
          <g transform="translate(45 77) scale(0.9167)">
            <path d={programIconPaths[icon]} className={index === 4 ? "stroke-white" : "stroke-brand-600"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <text x="96" y="84" className="fill-brand-950" fontSize="16" fontWeight="600">{label}</text>
          <text x="96" y="105" className="fill-neutral-500" fontSize="12">{detail}</text>
        </g>
      ))}
      <path d="M32 409H408" className="stroke-brand-100" />
      <text x="32" y="437" className="fill-brand-600" fontSize="13" fontWeight="500">Ваш опыт. Наша поддержка.</text>
    </svg>
  );
}
