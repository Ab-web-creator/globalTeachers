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
      <rect data-journey-panel x="1" y="1" width="438" height="458" rx="24" className="fill-white stroke-brand-300" />
      <image data-journey-ornament href="/images/footer-reference-pattern.webp" x="160" y="160" width="278" height="298" preserveAspectRatio="xMaxYMax slice" />
      <text data-journey-title x="220" y="42" textAnchor="middle" className="fill-brand-600" fontSize="12" fontWeight="600" letterSpacing="1.5">ПОДДЕРЖКА НА КАЖДОМ ЭТАПЕ</text>
      {stages.slice(1).map((stage, index) => (
        <path key={stage.label} data-journey-line pathLength="1" d={`M56 ${110 + index * 70}v26`} className="stroke-brand-200" strokeWidth="3" style={{ animationDelay: `${4.6 + index * 1.2}s, ${4.6 + index * 1.2}s` }} />
      ))}
      {stages.map(({ label, detail, icon }, index) => (
        <g key={label} transform={`translate(0 ${index * 70})`}>
          <g data-journey-stage style={{ animationDelay: `${2.8 + index * 1.2}s` }}>
          <circle data-journey-icon-bg data-final={index === stages.length - 1} cx="56" cy="88" r="22" className="fill-brand-50 stroke-brand-100" style={{ animationDelay: `${3.7 + index * 1.2}s, ${13.3 + index * 0.6}s` }} />
          <g transform="translate(45 77) scale(0.9167)">
            <path data-journey-icon data-final={index === stages.length - 1} d={programIconPaths[icon]} className="stroke-brand-600" style={{ animationDelay: `${3.7 + index * 1.2}s, ${13.3 + index * 0.6}s` }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <text x="96" y="84" className="fill-brand-950" fontSize="16" fontWeight="600">{label}</text>
          <text x="96" y="105" className="fill-neutral-500" fontSize="16">{detail}</text>
          </g>
        </g>
      ))}
      <path data-journey-divider d="M32 409H408" className="stroke-brand-100" />
      <text data-journey-closing x="32" y="437" className="fill-brand-600" fontSize="13" fontWeight="500">
        {Array.from("Ваш опыт. Наша поддержка.").map((letter, index) => (
          <tspan key={index} data-journey-letter style={{ animationDelay: `${9 + index * 0.065}s` }}>{letter}</tspan>
        ))}
      </text>
    </svg>
  );
}
