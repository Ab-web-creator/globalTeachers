import { FormSelectChevronIcon } from "@/app/components/svg";
import type { ComponentProps } from "react";

export default function FormSelect({ className = "", wrapperClassName = "mt-2", children, ...props }: ComponentProps<"select"> & { wrapperClassName?: string }) {
  return (
    <span className={`relative block ${wrapperClassName}`}>
      <select {...props} className={`${className} appearance-none pr-12`}>
        {children}
      </select>
      <FormSelectChevronIcon />
    </span>
  );
}
