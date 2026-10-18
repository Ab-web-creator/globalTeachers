"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
export default function RequiredMark() {
  const t = useTranslations();
  return <><span aria-hidden="true" className="text-red-600"> *</span><span className="sr-only"> {" "}{t("consultation.requiredMark.message0583")}</span></>;
}
