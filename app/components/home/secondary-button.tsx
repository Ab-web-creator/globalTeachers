import type { ComponentProps } from "react";

export default function SecondaryButton({ className = "", ...props }: ComponentProps<"button">) {
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-brand-100 px-8 py-3 text-sm font-medium text-brand-900 transition hover:bg-brand-200 sm:min-h-14 sm:px-9 sm:text-base ${className}`}
    />
  );
}
