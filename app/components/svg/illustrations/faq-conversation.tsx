import type { SVGProps } from "react";

export function FaqConversationIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 560 529" fill="none" aria-hidden="true" {...props}>
      <g transform="scale(1 1.15)">
      <rect x="106" y="57" width="280" height="326" rx="40" transform="rotate(-8 246 220)" className="fill-violet-100" />
      <g transform="rotate(6 251 210)">
        <rect x="137" y="65" width="240" height="300" rx="18" className="fill-violet-200/50" />
        <rect x="131" y="58" width="240" height="300" rx="18" className="fill-violet-50 stroke-violet-200" />
        <rect x="163" y="86" width="78" height="7" rx="3.5" className="fill-violet-300" />
        <path d="M163 112h176M163 132h140" className="stroke-violet-200" strokeWidth="5" strokeLinecap="round" />
      </g>
      <rect x="72" y="135" width="280" height="309" rx="20" className="fill-violet-950/5" />
      <rect x="70" y="129" width="280" height="309" rx="20" className="fill-violet-950/5" />
      <rect x="68" y="122" width="280" height="309" rx="20" className="fill-yellow-50 stroke-violet-200" />
      <path d="M88 122h240a20 20 0 0 1 20 20v39H68v-39a20 20 0 0 1 20-20Z" className="fill-violet-400" />
      <text x="94" y="158" fontFamily="Arial, sans-serif" fontSize="12" letterSpacing="2" fill="white">TEACHER NAVIGATOR</text>
      <text x="94" y="218" fontFamily="Arial, sans-serif" fontSize="22" fontWeight="600" className="fill-neutral-900">Ваши вопросы.</text>
      <text x="94" y="249" fontFamily="Arial, sans-serif" fontSize="22" fontWeight="600" className="fill-neutral-900">Понятные ответы.</text>
      <path d="M94 277h228M94 293h200M94 309h159" className="stroke-violet-200/70" strokeWidth="5" strokeLinecap="round" />
      <path d="M94 337h218M94 353h180" className="stroke-violet-200/70" strokeWidth="5" strokeLinecap="round" />
      <rect x="89" y="386" width="238" height="28" rx="14" className="fill-brand-50" />
      <circle cx="102" cy="400" r="9" className="fill-brand-100" />
      <path d="m98 400 3 3 5-6" className="stroke-brand-500" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <text x="119" y="404" fontFamily="Arial, sans-serif" fontSize="10" className="fill-brand-700">От первого шага до предложения</text>
      </g>
    </svg>
  );
}
