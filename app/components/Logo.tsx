import type { SVGProps } from "react";

type LogoProps = Omit<SVGProps<SVGSVGElement>, "children">;

export default function Logo({ className = "w-52", ...props }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 240 64"
      role="img"
      aria-label="Global Teacher Hub"
      className={`h-auto ${className}`}
      {...props}
    >
      <g transform="translate(10 10) scale(0.7)" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 39a24 24 0 1 1 44 0" />
        <circle cx="34" cy="26" r="19" />
        <ellipse cx="34" cy="26" rx="10" ry="19" />
        <path d="M34 7v43M17 18q17 9 34 0M15 27q19 7 38 0M19 37q15-8 30 0" />
        <path d="M34 57C25 44 15 40 4 40l4 10c10 0 18 4 26 10 8-6 16-10 26-10l4-10C53 40 43 44 34 57Z" />
        <path d="m6 46-4 10c13-2 24 1 32 7 8-6 19-9 32-7l-4-10M9 45c10 1 18 5 25 12 7-7 15-11 25-12" />
      </g>
      <text fill="currentColor" fontFamily="Arial, Helvetica, sans-serif" letterSpacing="0.2" aria-hidden="true">
        <tspan x="64" y="33" fontSize="22" fontWeight="900" textLength="104" lengthAdjust="spacing">GLOBAL</tspan>
        <tspan x="64" y="53" fontSize="18" fontWeight="400" textLength="104" lengthAdjust="spacing">Teacher Hub</tspan>
      </text>
    </svg>
  );
}
