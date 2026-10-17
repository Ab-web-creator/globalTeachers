import type { SVGProps } from "react";

export function CandidateGroupIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-5 shrink-0" {...props}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2 21v-2a7 7 0 0 1 14 0v2M16 4.5a3.5 3.5 0 0 1 0 7M22 21v-2a7 7 0 0 0-4-6.3" />
    </svg>
  );
}

export function ClientCheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-5 shrink-0" {...props}>
      <circle cx="9" cy="7" r="3.5" />
      <path d="M2 21v-2a7 7 0 0 1 11-5.7M15 18l2 2 5-6" />
    </svg>
  );
}

export function BriefcaseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-5 shrink-0" {...props}>
      <rect x="3" y="7" width="18" height="14" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12a20 20 0 0 0 18 0M12 12v4" />
    </svg>
  );
}

export function SnowflakeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-5 shrink-0" {...props}>
      <path d="M12 2v20M3.34 7l17.32 10M3.34 17 20.66 7M9 4l3 3 3-3M9 20l3-3 3 3M3.57 10.6l4.1-1.1-1.1-4.1M17.43 18.6l-1.1-4.1 4.1-1.1M6.57 18.6l1.1-4.1-4.1-1.1M20.43 10.6l-4.1-1.1 1.1-4.1" />
    </svg>
  );
}

export function ReplyMailIcon(props: SVGProps<SVGSVGElement>) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m10 5-7 7 7 7v-5c5 0 8 1 11 5-1-8-5-10-11-10Z" /></svg>;
}

export function ReplyAllMailIcon(props: SVGProps<SVGSVGElement>) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m7 5-6 7 6 7M13 5l-7 7 7 7v-5c4 0 7 1 10 5-1-8-5-10-10-10Z" /></svg>;
}

export function ForwardMailIcon(props: SVGProps<SVGSVGElement>) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m14 5 7 7-7 7v-5c-5 0-8 1-11 5C4 11 8 9 14 9Z" /></svg>;
}
