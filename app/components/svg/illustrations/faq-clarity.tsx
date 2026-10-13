import type { SVGProps } from "react";
import { programIconPaths } from "../data/program-icon-paths";

const topics = [
  { title: "Оценим ваши возможности", lines: ["Образование, опыт и квалификация"], icon: "search" },
  { title: "Определим направления", lines: ["Подходящие страны, школы и требования"], icon: "globe" },
  { title: "Подготовим к поиску", lines: ["CV, документы и собеседования"], icon: "document" },
  { title: "Составим план действий", lines: ["Что делать сейчас и к чему готовиться"], icon: "compass" },
] as const;

export function FaqClarityIllustration({ ornament = "/images/footer-reference-pattern.webp", ...props }: SVGProps<SVGSVGElement> & { ornament?: string; }) {
  return (
    <svg viewBox="0 0 440 503" fill="none" aria-hidden="true" {...props}>
      <rect data-faq-panel x="1" y="1" width="414" height="501" rx="28" className="fill-white stroke-brand-200" />
      <text data-faq-eyebrow x="208" y="30" textAnchor="middle" dominantBaseline="central" className="fill-brand-600" fontSize="12" fontWeight="600" letterSpacing="1.5">ВАШ СЛЕДУЮЩИЙ ШАГ</text>
      <g transform="translate(-12 20)">
      {ornament ? <image data-faq-ornament href={ornament} x="180" y="135" width="246" height="360" preserveAspectRatio="xMaxYMax slice" /> : null}
      <g data-faq-intro>
        <rect data-faq-intro-background x="32" y="35" width="344" height="62" rx="18" className="fill-brand-100" />
        <circle cx="63" cy="66" r="18" className="fill-brand-500" />
        <text x="63" y="72" textAnchor="middle" className="fill-white" fontSize="20" fontWeight="600">?</text>
        <text data-faq-intro-text x="96" y="61" className="fill-brand-950" fontSize="15" fontWeight="600">Не знаете, с чего начать?</text>
        <text data-faq-intro-text x="96" y="83" className="fill-neutral-500" fontSize="15">
          <tspan x="96">Поможем определить ваш первый шаг</tspan>
        </text>
      </g>
      {topics.map(({ title, lines, icon }, index) => (
        <g key={title}>
          <path data-faq-line pathLength="1" d={`M60 ${index === 0 ? 97 : 151 + (index - 1) * 66}V${107 + index * 66}`} className="stroke-brand-300" strokeWidth="2" style={{ animationDelay: `${6.1 + index * 1.1}s` }} />
          <g data-faq-topic style={{ animationDelay: `${6.4 + index * 1.1}s` }}>
            <circle cx="60" cy={129 + index * 66} r="22" className="fill-brand-50 stroke-brand-200" />
            <g transform={`translate(49 ${118 + index * 66}) scale(0.9167)`}>
              <path d={programIconPaths[icon]} className="stroke-brand-600" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <text x="100" y={124 + index * 66} className="fill-brand-950" fontSize="15" fontWeight="600">{title}</text>
            <text x="100" y={148 + index * 66} className="fill-neutral-500" fontSize="14">
              {lines.map((line, lineIndex) => <tspan key={line} x="100" dy={lineIndex === 0 ? 0 : 18}>{line}</tspan>)}
            </text>
          </g>
        </g>
      ))}
      </g>
      <g data-faq-topic style={{ animationDelay: "10.8s" }}>
        <rect data-faq-summary-background x="20" y="394" width="300" height="36" rx="12" className="fill-brand-50" />
        <text data-faq-summary-text x="32" y="412" dominantBaseline="central" className="fill-brand-600" fontSize="13">
          <tspan x="32">От первых вопросов — к понятному плану</tspan>
        </text>
      </g>
    </svg>
  );
}
