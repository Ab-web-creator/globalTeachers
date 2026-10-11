import type { SVGProps } from "react";
import { programIconPaths } from "../data/program-icon-paths";

const topics = [
  { title: "Работа за рубежом", text: "Страны, школы и требования", icon: "globe" },
  { title: "Подготовка к поиску", text: "Опыт, документы и интервью", icon: "document" },
  { title: "Наша поддержка", text: "Понятные шаги и помощь рядом", icon: "chat" },
] as const;

export function FaqClarityIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 440 532" fill="none" aria-hidden="true" {...props}>
      <rect data-faq-panel x="1" y="1" width="406" height="530" rx="28" className="fill-white stroke-brand-200" />
      <text data-faq-eyebrow x="204" y="40" textAnchor="middle" dominantBaseline="central" className="fill-brand-600" fontSize="12" fontWeight="600" letterSpacing="1.5">ПОЛЕЗНО ЗНАТЬ</text>
      <g transform="translate(0 40)">
      <image data-faq-ornament href="/images/footer-reference-pattern.webp" x="160" y="180" width="246" height="298" preserveAspectRatio="xMaxYMax slice" />
      <g data-faq-intro>
        <rect x="32" y="30" width="344" height="72" rx="18" className="fill-brand-50" />
        <path d="m64 102-8 15 32-15" className="fill-brand-50" />
        <circle cx="63" cy="66" r="18" className="fill-brand-500" />
        <text x="63" y="72" textAnchor="middle" className="fill-white" fontSize="20" fontWeight="600">?</text>
        <text x="96" y="61" className="fill-brand-950" fontSize="17" fontWeight="600">С чего начать?</text>
        <text x="96" y="83" className="fill-neutral-500" fontSize="16">Разберёмся вместе.</text>
      </g>
      {topics.map(({ title, text, icon }, index) => (
        <g key={title}>
          <path data-faq-line pathLength="1" d={`M60 ${index === 0 ? 117 : 187 + (index - 1) * 88}V${143 + index * 88}`} className="stroke-brand-300" strokeWidth="2" style={{ animationDelay: `${6.1 + index * 1.1}s` }} />
          <g data-faq-topic style={{ animationDelay: `${6.4 + index * 1.1}s` }}>
            <circle cx="60" cy={165 + index * 88} r="22" className="fill-brand-50 stroke-brand-200" />
            <g transform={`translate(49 ${154 + index * 88}) scale(0.9167)`}>
              <path d={programIconPaths[icon]} className="stroke-brand-600" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <text x="100" y={160 + index * 88} className="fill-brand-950" fontSize="17" fontWeight="600">{title}</text>
            <text x="100" y={184 + index * 88} className="fill-neutral-500" fontSize="16">{text}</text>
          </g>
        </g>
      ))}
      </g>
      <path data-faq-separator d="M32 429H376" className="stroke-brand-200" />
    </svg>
  );
}
