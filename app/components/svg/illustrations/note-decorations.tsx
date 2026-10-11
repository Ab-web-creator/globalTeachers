import type { SVGProps } from "react";

export function MentorSignatureUnderline(svgProps: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 200 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="mt-2 w-44 text-brand-300 sm:w-52" {...svgProps}>
      <path d="M2 10C40 3 90 2 140 6s40 2 56-2" />
    </svg>
  );
}
