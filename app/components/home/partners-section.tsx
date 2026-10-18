"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import SchoolCarousel from "./school-carousel";

export default function PartnersSection() {
  const t = useTranslations();
  return (
    <div data-reveal className="border-y border-brand-200 bg-linear-to-r from-blue-50 to-violet-100 sm:border-y-0">
      <div className="mx-auto w-full max-w-400 px-6 py-4 sm:px-10 lg:py-5 xl:py-6 lg:px-16 xl:px-20">
        <h2 id="partners-title" className="text-center text-base font-normal text-neutral-600 sm:text-lg">
          {t("home.partnersSection.message0448")}</h2>
        <SchoolCarousel />
      </div>
    </div>
  );
}
