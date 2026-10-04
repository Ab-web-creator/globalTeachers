import type { ReactNode } from "react";

const sizes = {
  default: "text-3xl sm:text-4xl",
  small: "text-base sm:text-lg",
};

export default function SectionHeading({ id, size = "default", className = "", children }: { id: string; size?: keyof typeof sizes; className?: string; children: ReactNode }) {
  return (
    <h2 id={id} className={`font-semibold leading-tight tracking-tight ${sizes[size]} ${className}`}>
      {children}
    </h2>
  );
}
