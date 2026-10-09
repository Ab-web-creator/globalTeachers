import type { SVGProps } from "react";

export function ResearchIdeaIcon(svgProps: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-7 sm:size-8" {...svgProps}>
      <path d="M9 18h6m-5 3h4M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 4H9c0-2 0-3-1-4ZM2 8H1m22 0h-1M5 2 4 1m15 1 1-1" />
    </svg>
  );
}

export function InterviewTopicIcon({ path, ...svgProps }: SVGProps<SVGSVGElement> & { path: string; }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-6" {...svgProps}>
      <path d={path} />
    </svg>
  );
}

export function AboutBenefitCheckIcon(svgProps: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-6 shrink-0 text-brand-500" stroke="currentColor" strokeWidth="2" aria-hidden="true" {...svgProps}><path d="m3 12 6 6L22 5" /></svg>
  );
}

export function ExperienceIdeaIcon(svgProps: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4 sm:size-6" {...svgProps}><path d="M9 18h6m-5 3h4M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 4H9c0-2 0-3-1-4ZM2 8H1m22 0h-1M5 2 4 1m15 1 1-1" /></svg>
  );
}

export function ExperienceStatusIcon({ path, ...svgProps }: SVGProps<SVGSVGElement> & { path: string; }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-4 sm:size-6" {...svgProps}><path d={path} /></svg>
  );
}

export function ProgramListEllipsisIcon(svgProps: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-6" {...svgProps}>
      <circle cx="5" cy="12" r="2.2" />
      <circle cx="12" cy="12" r="2.2" />
      <circle cx="19" cy="12" r="2.2" />
    </svg>
  );
}

export function ProgramQuestionIcon(svgProps: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="size-6" {...svgProps}>
      <path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 4m0 3h.01" />
      <path d="M21 11.5a9 9 0 0 1-9 9H4l-2 2v-11a9.5 9.5 0 0 1 19 0Z" />
    </svg>
  );
}

export function TierFeatureStarIcon(svgProps: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-4" {...svgProps}><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z" /></svg>
  );
}

export function PanelTopicIcon({ path, ...svgProps }: SVGProps<SVGSVGElement> & { path: string; }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-7" {...svgProps}>
      <path d={path} />
    </svg>
  );
}

export function InterviewQuestionIcon({ path, ...svgProps }: SVGProps<SVGSVGElement> & { path: string; }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-5" {...svgProps}>
      <path d={path} />
    </svg>
  );
}
