import type { SVGProps } from "react";
import { interviewNotesMaskUrl } from "../assets";

export function InterviewNotesIllustration(svgProps: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" viewBox="0 88 1024 1380" preserveAspectRatio="xMidYMax meet" className="absolute inset-0 h-full w-full" {...svgProps}>
      <image href="/images/interview-notes-cutout.webp" width="1024" height="1536" style={{ maskImage: `url(${interviewNotesMaskUrl})`, maskSize: "100% 100%", maskRepeat: "no-repeat" }} />
    </svg>
  );
}

export function InterviewAnswerIllustration(svgProps: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 400 400" fill="none" className="w-full max-w-md text-brand-300" {...svgProps}>
      <circle cx="196" cy="202" r="143" fill="currentColor" opacity="0.12" />
      <ellipse cx="200" cy="346" rx="137" ry="17" fill="currentColor" opacity="0.15" />
      <g strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <g transform="rotate(-9 169 215)">
          <rect x="82" y="92" width="182" height="246" rx="16" fill="white" stroke="currentColor" />
          <rect x="109" y="119" width="66" height="8" rx="4" fill="currentColor" opacity="0.6" />
          <path d="M109 148h116" stroke="currentColor" />
          <circle cx="119" cy="183" r="13" className="fill-violet-100" />
          <circle cx="119" cy="229" r="13" className="fill-sky-100" />
          <circle cx="119" cy="275" r="13" className="fill-amber-100" />
          <path d="M147 179h70M147 190h48M147 225h70M147 236h56M147 271h70M147 282h42" stroke="currentColor" />
          <path d="m113 275 4 4 8-9" className="stroke-brand-500" />
        </g>
        <path d="M230 62h102a17 17 0 0 1 17 17v64a17 17 0 0 1-17 17h-51l-32 25v-25h-19a17 17 0 0 1-17-17V79a17 17 0 0 1 17-17Z" fill="white" stroke="currentColor" />
        <path d="M238 96h14l-5 16h-9ZM263 96h14l-5 16h-9Z" className="fill-brand-500 stroke-brand-500" />
        <path d="M291 97h31M291 111h23M238 135h84" stroke="currentColor" />
        <path d="M272 258h17v54h-17ZM300 237h17v75h-17ZM328 213h17v99h-17Z" fill="currentColor" opacity="0.45" />
        <path d="m275 239 26-28 32-18M321 190l12 3-2 12" className="stroke-brand-500" />
      </g>
    </svg>
  );
}
