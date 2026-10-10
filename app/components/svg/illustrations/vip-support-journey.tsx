import type { SVGProps } from "react";
import { programIconPaths } from "../data/program-icon-paths";

const stages = [
  { label: "Стратегия", icon: "compass", x: 105, y: 105 },
  { label: "Документы", icon: "document", x: 335, y: 105 },
  { label: "Вакансии и заявки", icon: "search", x: 335, y: 265 },
  { label: "Интервью", icon: "chat", x: 105, y: 265 },
  { label: "Предложение", icon: "school", x: 105, y: 425 },
] as const;

export function VipSupportJourneyIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 440 510" fill="none" aria-hidden="true" {...props}>
      <g className="stroke-brand-300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M149 105H285 M335 169V214 M291 265H155 M105 329V374" />
        <path d="m278 99 7 6-7 6 M329 207l6 7 6-7 m-179 52-7 6 7 6 M99 367l6 7 6-7" />
      </g>
      {stages.map(({ label, icon, x, y }, index) => (
        <g key={label}>
          <circle cx={x} cy={y} r="42" className={index === 4 ? "fill-brand-500" : "fill-brand-50 stroke-brand-200"} />
          <g transform={`translate(${x - 16} ${y - 16}) scale(1.3333)`}>
            <path d={programIconPaths[icon]} className={index === 4 ? "stroke-white" : "stroke-brand-600"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <circle cx={x + 31} cy={y - 31} r="12" className="fill-white stroke-brand-200" />
          <text x={x + 31} y={y - 27} textAnchor="middle" className="fill-brand-600" fontSize="10" fontWeight="600">{index + 1}</text>
          <text x={x} y={y + 64} textAnchor="middle" className="fill-brand-950" fontSize="16" fontWeight="600">{label}</text>
        </g>
      ))}
      <path d="M164 425H193" className="stroke-brand-200" strokeWidth="2" />
      <text x="211" y="420" className="fill-brand-600" fontSize="15" fontWeight="500">Ваш опыт.</text>
      <text x="211" y="444" className="fill-brand-600" fontSize="15" fontWeight="500">Наша поддержка.</text>
    </svg>
  );
}
