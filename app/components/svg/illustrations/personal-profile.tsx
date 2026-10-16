import { useId, type SVGProps } from "react";

export function PersonalProfileIllustration(props: SVGProps<SVGSVGElement>) {
  const id = useId().replaceAll(":", "");
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" {...props}>
      <defs>
        <linearGradient id={`${id}-background`} x1="8" y1="6" x2="58" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f9f5ff" /><stop offset="1" stopColor="#e6e2ff" />
        </linearGradient>
        <linearGradient id={`${id}-gold`} x1="22" y1="10" x2="42" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f4d58c" /><stop offset="1" stopColor="#af7b29" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="32" fill={`url(#${id}-background)`} />
      <circle cx="32" cy="32" r="27.5" stroke="#c6b2dd" strokeOpacity=".65" />
      <path d="M17 58c0-10 6.5-17 15-17s15 7 15 17" fill="var(--color-brand-500)" fillOpacity=".85" />
      <circle cx="32" cy="32" r="9" fill="var(--color-brand-500)" />
      <path d="m22 13 5 4 5-8 5 8 5-4-2.5 9h-15Z" fill={`url(#${id}-gold)`} stroke="#b58b46" strokeWidth=".7" strokeLinejoin="round" />
      <path d="m48 26 1.2 3.8L53 31l-3.8 1.2L48 36l-1.2-3.8L43 31l3.8-1.2Z" fill="#c4a363" />
      <circle cx="16" cy="36" r="1.5" fill="#c4a363" />
    </svg>
  );
}
