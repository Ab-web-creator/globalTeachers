import { FormSelectChevronIcon } from "@/app/components/svg";
import type { ComponentProps } from "react";

export default function FormSelect({ className = "", children, ...props }: ComponentProps<"select">) {
  return (
    <span className="relative mt-2 block">
      <select {...props} className={`${className} appearance-none pr-12`}>
        {children}
      </select>
      <FormSelectChevronIcon />
    </span>
  );
}
