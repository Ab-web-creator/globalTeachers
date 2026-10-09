import type { SVGProps } from "react";

export function RelocationDocumentsIllustration(svgProps: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 400 340" fill="none" className="mx-auto hidden w-full max-w-sm text-brand-300 lg:block" {...svgProps}>
      <ellipse cx="210" cy="285" rx="155" ry="22" fill="currentColor" opacity="0.15" />
      <circle cx="230" cy="166" r="125" fill="currentColor" opacity="0.1" />
      <g strokeLinecap="round" strokeLinejoin="round">
        <g transform="rotate(10 284 200)" stroke="currentColor" strokeWidth="3">
          <rect x="213" y="119" width="131" height="151" rx="18" fill="white" />
          <path d="M250 119v-17a9 9 0 0 1 9-9h40a9 9 0 0 1 9 9v17" />
          <path d="M239 139v110M318 139v110" opacity="0.6" />
          <rect x="262" y="173" width="35" height="27" rx="5" fill="currentColor" opacity="0.3" />
          <path d="M240 273v9M317 273v9" strokeWidth="8" />
        </g>
        <g transform="rotate(-12 145 160)" stroke="currentColor" strokeWidth="3">
          <path d="M91 65h78l26 26v133a9 9 0 0 1-9 9H91a9 9 0 0 1-9-9V74a9 9 0 0 1 9-9Z" fill="white" />
          <path d="M169 65v26h26M105 112h65M105 130h52M105 148h61" />
          <path d="m107 180 9 9 21-22" className="stroke-brand-500" />
        </g>
        <g transform="rotate(7 179 225)">
          <rect x="128" y="156" width="103" height="132" rx="10" className="fill-brand-500" />
          <rect x="137" y="165" width="85" height="114" rx="5" stroke="white" strokeOpacity="0.4" />
          <circle cx="179" cy="212" r="23" stroke="white" strokeWidth="2" />
          <ellipse cx="179" cy="212" rx="10" ry="23" stroke="white" strokeWidth="2" />
          <path d="M156 212h46M162 199h34M162 225h34M164 253h30" stroke="white" strokeWidth="2" />
        </g>
        <path d="M280 52h14M287 45v14M58 215h12M64 209v12" stroke="currentColor" strokeWidth="3" />
        <circle cx="344" cy="87" r="4" fill="currentColor" />
      </g>
    </svg>
  );
}
