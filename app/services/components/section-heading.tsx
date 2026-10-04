import type { ReactNode } from "react";

export default function SectionHeading({ id, className = "", children }: { id: string; className?: string; children: ReactNode }) {
  return (
    <h2 id={id} className={`text-3xl font-semibold leading-tight tracking-tight sm:text-4xl ${className}`}>
      {children}
    </h2>
  );
}
