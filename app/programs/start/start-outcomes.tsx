"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import Image from "next/image";
import { StartOutcomesPotOverlay } from "@/app/components/svg";
import SectionHeading from "../../services/components/section-heading";
import SectionLabel from "../../services/components/job-search/section-label";
import NumberedSteps from "../components/numbered-steps";

export default function StartOutcomes({ flow }: { flow: string }) {
  const t = useTranslations();
  return (
    <section aria-labelledby="start-outcomes" className="grid items-center gap-10 lg:grid-cols-5 lg:gap-12 py-12 sm:py-16 lg:py-20">
      <div className="min-w-0 lg:col-span-3">
        <SectionLabel>{t("programs.start.startOutcomes.message1223")}</SectionLabel>
        <SectionHeading id="start-outcomes">{t("programs.start.startOutcomes.message1224")}</SectionHeading>
        <p className="mt-7 max-w-2xl text-lg leading-relaxed text-neutral-600">{t("programs.start.startOutcomes.message1225")}</p>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-neutral-600">{t("programs.start.startOutcomes.message1226")}</p>
        <div className="max-w-2xl">
          <NumberedSteps flow={flow} />
        </div>
      </div>
      <div className="overflow-hidden hidden w-full max-w-sm justify-self-center lg:col-span-2 lg:block">
        <div className="relative -mt-[0.5%] -mb-[20%]">
        <Image src="/images/start-outcomes-flower-stand-v15.webp" alt={t("programs.start.startOutcomes.message1227")} width={1024} height={1536} sizes="384px" className="h-auto w-full object-contain" />
        <StartOutcomesPotOverlay />
        </div>
      </div>
    </section>
  );
}
