import type { SVGProps } from "react";

export function ConsultationCalendarIcon({ clock = false, ...props }: SVGProps<SVGSVGElement> & { clock?: boolean }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d={clock ? "M16 27H6a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3h18a3 3 0 0 1 3 3v6" : "M6 5h18a3 3 0 0 1 3 3v16a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3Z"} />
      <path d="M9 2v6M21 2v6M3 12h24M9 17h9M9 22h4" />
      {clock && <><circle cx="23" cy="23" r="7" fill="var(--color-violet-50)" /><path d="M23 19v4l2 2" /></>}
    </svg>
  );
}
