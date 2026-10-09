import type { SVGProps } from "react";

export function HeroAirplaneIllustration({ className, ...svgProps }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 40" className={className} fill="currentColor" {...svgProps}>
      <path d="M5 25 2 10h7l13 14 30-1L39 4h9l27 18 25-1c8 0 16 4 18 7-3 3-9 4-17 4H74L49 39h-9l15-8-32-1-12 3H5l5-5Z" />
    </svg>
  );
}
