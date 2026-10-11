import type { SVGProps } from "react";

export function AboutGraduationIllustration(svgProps: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="1.5" className="pointer-events-none absolute -right-6 -bottom-5 -z-10 size-36 rotate-12 text-white/15 sm:size-48" aria-hidden="true" {...svgProps}>
      <path d="m10 42 50-24 50 24-50 24-50-24Zm18 10v30c18 14 46 14 64 0V52M110 42v38M15 100c18-8 32-8 45 0 13-8 27-8 45 0M15 108c18-8 32-8 45 0 13-8 27-8 45 0" />
    </svg>
  );
}
