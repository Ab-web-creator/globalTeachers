"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import { FormSelectChevronIcon } from "@/app/components/svg";
import type { ComponentProps } from "react";

export default function FormSelect({ className = "", wrapperClassName = "mt-2", children, ...props }: ComponentProps<"select"> & { wrapperClassName?: string }) {
  const t = useTranslations();
  return (
    <span className={`relative block ${wrapperClassName}`}>
      <select {...props} className={`${className} appearance-none pr-12`}>
        {t.content(children)}
      </select>
      <FormSelectChevronIcon />
    </span>
  );
}
