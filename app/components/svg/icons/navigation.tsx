import type { SVGProps } from "react";

export function HeaderBackArrowIcon(svgProps: SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" {...svgProps}><path fill="currentColor" d="M11 6 4 12l7 6v-4h9v-4h-9z" /></svg>
  );
}

export function MenuToggleIcon({ open, ...svgProps }: SVGProps<SVGSVGElement> & { open: boolean; }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true" {...svgProps}><path d={open ? "M6 6l12 12M6 18 18 6" : "M3 6h18M3 12h18M3 18h18"} /></svg>
  );
}

export function BackLinkArrowIcon(svgProps: SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" {...svgProps}><path fill="currentColor" d="M11 6 4 12l7 6v-4h9v-4h-9z" /></svg>
  );
}

export function FaqToggleIcon(svgProps: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-5" {...svgProps}>
      <path d="M4 10h12" />
      <path d="M10 4v12" className="group-open:hidden" />
    </svg>
  );
}

export function MobileMenuCloseIcon(svgProps: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-6" aria-hidden="true" {...svgProps}><path d="m6 6 12 12M6 18 18 6" /></svg>
  );
}

export function SlideshowPlaybackIcon({ paused, ...svgProps }: SVGProps<SVGSVGElement> & { paused: boolean; }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="currentColor" {...svgProps}>
      {paused ? <path d="m8 5 11 7-11 7Z" /> : <path d="M7 5h4v14H7zM14 5h4v14h-4z" />}
    </svg>
  );
}

export function PortfolioCarouselArrowIcon({ className, ...svgProps }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" {...svgProps}>
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}
