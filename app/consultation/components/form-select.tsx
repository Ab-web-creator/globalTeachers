import type { ComponentProps } from "react";

export default function FormSelect({ className = "", children, ...props }: ComponentProps<"select">) {
  return (
    <span className="relative mt-2 block">
      <select {...props} className={`${className} appearance-none pr-12`}>
        {children}
      </select>
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-brand-600">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </span>
  );
}
