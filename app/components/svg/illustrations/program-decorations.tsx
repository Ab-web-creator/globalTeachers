import type { SVGProps } from "react";

export function AboutGraduationIllustration(svgProps: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="1.5" className="pointer-events-none absolute -right-6 -bottom-5 -z-10 size-36 rotate-12 text-white/15 sm:size-48" aria-hidden="true" {...svgProps}>
      <path d="m10 42 50-24 50 24-50 24-50-24Zm18 10v30c18 14 46 14 64 0V52M110 42v38M15 100c18-8 32-8 45 0 13-8 27-8 45 0M15 108c18-8 32-8 45 0 13-8 27-8 45 0" />
    </svg>
  );
}

export function PreparationDocumentsIllustration(svgProps: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 260 120" fill="none" className="h-auto w-full" {...svgProps}>
      <rect x="36" y="20" width="84" height="92" rx="12" fill="white" transform="rotate(-9 36 20)" />
      <path d="M55 43h40M55 56h32M55 69h36" className="stroke-brand-300" strokeWidth="4" strokeLinecap="round" />
      <rect x="93" y="39" width="103" height="70" rx="12" fill="#e0f2fe" transform="rotate(7 93 39)" />
      <path d="m99 48 42 34 47-24" stroke="#93c5fd" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M184 16h49a12 12 0 0 1 12 12v19a12 12 0 0 1-12 12h-17l-15 12V59h-17a12 12 0 0 1-12-12V28a12 12 0 0 1 12-12Z" className="fill-brand-200" />
      <path d="m194 37 8 8 17-18" className="stroke-brand-500" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
