import type { SVGProps } from "react";

export function SubjectTagRemoveIcon(svgProps: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="size-4" {...svgProps}><path d="m6 6 12 12M18 6 6 18" /></svg>
  );
}

export function ConsultationDetailIcon({ path, ...svgProps }: SVGProps<SVGSVGElement> & { path: string; }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="size-6 shrink-0" aria-hidden="true" {...svgProps}><path d={path} /></svg>
  );
}

export function SubjectPickerChevronIcon({ className, ...svgProps }: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} {...svgProps}><path d="m6 9 6 6 6-6" /></svg>
  );
}

export function SubjectListRemoveIcon(svgProps: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="size-4" {...svgProps}><path d="m6 6 12 12M18 6 6 18" /></svg>
  );
}

export function SubjectSelectedCheckIcon(svgProps: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-1 size-5 shrink-0 text-brand-500 opacity-0 peer-checked:opacity-100" {...svgProps}><path d="m5 12 4 4L19 6" /></svg>
  );
}

export function FormSelectChevronIcon(svgProps: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-brand-600" {...svgProps}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
