import type { SVGProps } from "react";

export function HandwrittenHeartIcon(svgProps: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="inline size-6 align-baseline" {...svgProps}>
      <path d="M12 20s-7-4.4-7-9.6A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.4C19 15.6 12 20 12 20Z" />
    </svg>
  );
}

export function HandwrittenNoteUnderline(svgProps: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="mt-3 ml-8 w-28" {...svgProps}>
      <path d="M2 10C30 4 60 2 98 2" />
    </svg>
  );
}

export function MentorSignatureUnderline(svgProps: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 200 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="mt-2 w-44 text-brand-300 sm:w-52" {...svgProps}>
      <path d="M2 10C40 3 90 2 140 6s40 2 56-2" />
    </svg>
  );
}
