import type { ComponentProps } from "react";

export default function PrimaryButton(props: ComponentProps<"button">) {
  return <button {...props} className={"inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#00566b] px-8 py-3 text-sm font-medium text-white transition hover:bg-[#003e4d] sm:min-h-14 sm:px-9 sm:text-base"} />;
}
