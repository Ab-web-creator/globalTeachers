import type { ComponentProps } from "react";

export default function PrimaryButton({ className = "", ...props }: ComponentProps<"button">) {
  return <button {...props} className={`inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-brand-500 px-8 py-3 text-sm font-medium text-white transition hover:bg-brand-600 sm:min-h-14 sm:px-9 sm:text-base ${className}`} />;
}
