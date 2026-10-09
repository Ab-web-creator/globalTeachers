import type { SVGProps } from "react";

export function JobSearchStepIcon({ path, ...svgProps }: SVGProps<SVGSVGElement> & { path: string; }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="size-10" {...svgProps}>
      <path d={path} />
    </svg>
  );
}

export function StepConnectorArrowIcon(svgProps: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-5" {...svgProps}>
      <path d="M5 12h14 M13 6l6 6-6 6" />
    </svg>
  );
}

export function PlatformExternalLinkIcon(svgProps: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-5 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" {...svgProps}>
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

export function SchoolMapPinIcon({ className, ...svgProps }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...svgProps}>
      <path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
    </svg>
  );
}
