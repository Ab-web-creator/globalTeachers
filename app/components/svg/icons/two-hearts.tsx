import type { SVGProps } from "react";

export function TwoHeartsIcon({ solid = false, ...props }: SVGProps<SVGSVGElement> & { solid?: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 33 5 22C-3 14 9 5 16 14c7-9 19 0 11 8L16 33Z" fill="currentColor" fillOpacity={solid ? 1 : 0.12} />
      <path d="m29 20-7-7c-5-5 3-11 7-5 4-6 12 0 7 5l-7 7Z" fill="currentColor" fillOpacity={solid ? 1 : 0.25} />
    </svg>
  );
}
