import type { ComponentProps } from "react";

export default function SecondaryButton({ className = "", ...props }: ComponentProps<"button">) {
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex min-h-11 items-center justify-center gap-3 rounded-2xl sm:rounded-full action-gradient-outline px-8 py-2.5 sm:py-3 text-sm font-medium text-brand-700 transition hover:shadow-md sm:min-h-14 sm:px-9 sm:text-base ${className}`}
    />
  );
}
