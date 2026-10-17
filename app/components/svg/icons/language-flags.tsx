import type { SVGProps } from "react";

export function BritishFlagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 16" {...props}>
      <path fill="#012169" d="M0 0h32v16H0z" />
      <path fill="#fff" d="M0 0h3.6L32 14.2V16h-3.6L0 1.8Zm32 0h-3.6L0 14.2V16h3.6L32 1.8Z" />
      <path fill="#c8102e" d="M0 0h1.2L32 15.4v.6h-1.2L0 .6Zm32 0h-1.2L0 15.4v.6h1.2L32 .6Z" />
      <path fill="#fff" d="M13 0h6v16h-6ZM0 5h32v6H0Z" />
      <path fill="#c8102e" d="M14.2 0h3.6v16h-3.6ZM0 6.2h32v3.6H0Z" />
    </svg>
  );
}

export function KyrgyzFlagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 16" {...props}>
      <path fill="#e8112d" d="M0 0h32v16H0z" />
      <g fill="#ffef00">
        {Array.from({ length: 40 }, (_, index) => (
          <path key={index} d="m15.82 4.7.18-1.5.18 1.5Z" transform={`rotate(${index * 9} 16 8)`} />
        ))}
        <circle cx="16" cy="8" r="3.2" />
      </g>
      <circle cx="16" cy="8" r="2.35" fill="#e8112d" />
      <g fill="none" stroke="#ffef00" strokeWidth=".35">
        <path d="M14.1 6.6q1.9.2 3.8 2.8M14.6 6q1.9.6 3.3 2.8M15.2 5.8q1.8.9 2.9 2.2M17.9 6.6q-1.9.2-3.8 2.8M17.4 6q-1.9.6-3.3 2.8M16.8 5.8q-1.8.9-2.9 2.2" />
      </g>
    </svg>
  );
}

export function RussianFlagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 16" {...props}>
      <path fill="#fff" d="M0 0h32v16H0z" />
      <path fill="#0039a6" d="M0 5.333h32v5.334H0z" />
      <path fill="#d52b1e" d="M0 10.667h32V16H0z" />
    </svg>
  );
}

export function UzbekFlagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 16" {...props}>
      <path fill="#0099b5" d="M0 0h32v16H0z" />
      <path fill="#ce1126" d="M0 5h32v6H0z" />
      <path fill="#fff" d="M0 5.4h32v5.2H0z" />
      <path fill="#1eb53a" d="M0 11h32v5H0z" />
      <circle cx="5" cy="2.5" r="1.8" fill="#fff" />
      <circle cx="5.7" cy="2.5" r="1.5" fill="#0099b5" />
      {[[11,1],[13,1],[15,1],[9,2.5],[11,2.5],[13,2.5],[15,2.5],[7,4],[9,4],[11,4],[13,4],[15,4]].map(([x,y]) => (
        <path key={`${x}-${y}`} fill="#fff" d="m0-.55.13.38h.4l-.32.24.12.38L0 .21l-.33.24.12-.38-.32-.24h.4Z" transform={`translate(${x} ${y})`} />
      ))}
    </svg>
  );
}
