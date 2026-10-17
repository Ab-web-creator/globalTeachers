import type { SVGProps } from "react";

export function FriendlyConversationIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="10" cy="22" r="5" fill="currentColor" fillOpacity="0.1" />
      <circle cx="30" cy="22" r="5" fill="currentColor" fillOpacity="0.1" />
      <path d="M2 37v-3a8 8 0 0 1 16 0v3M22 37v-3a8 8 0 0 1 16 0v3M8 23q2 2 4 0M28 23q2 2 4 0" />
      <path d="M8 3h12a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3h-6l-4 3v-3H8a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Z" fill="currentColor" fillOpacity="0.08" />
      <path d="M27 7h5a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3v3l-4-3h-2M10 8h8" />
    </svg>
  );
}
