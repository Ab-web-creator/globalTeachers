import type { SVGProps } from "react";

export function StrategyRouteIllustration(svgProps: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 600 450" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 -z-10 hidden h-full w-full text-brand-300/40 sm:block" fill="none" stroke="currentColor" strokeWidth="1.5" {...svgProps}>
      <path d="M300 225C210 225 240 75 100 75 M300 225C390 225 360 75 500 75 M100 225H500 M300 225C210 225 240 375 100 375 M300 225C390 225 360 375 500 375" />
    </svg>
  );
}
