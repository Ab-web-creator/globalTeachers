"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import { programIconPaths } from "@/app/components/svg";
import IconCard from "../../services/components/icon-card";
import ProgramSection from "../components/program-section";
import StatCard from "../components/stat-card";
import { practice } from "./content";

export default function ProPractice() {
  const t = useTranslations();
  return (
    <ProgramSection id="pro-practice" label={t("programs.pro.proPractice.message1180")} title={t("programs.pro.proPractice.message1181")}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 bg-linear-to-b from-sky-100 via-cyan-50/50 via-20% to-sky-100/0 to-50%" />
      <p className="mt-7 max-w-3xl text-lg leading-relaxed text-neutral-600">{t.content(practice.description)}</p>
      <ul className="mt-10 grid gap-4 [&>li.group]:p-3 max-sm:[&>li.group>h3]:pt-2 sm:[&>li.group]:p-5 md:grid-cols-2">
        {practice.inclusions.map(({ icon, title, paragraphs }) => (
          <IconCard
            key={title}
            icon={programIconPaths[icon]}
            title={t.content(title)}
            paragraphs={paragraphs}
            surface="border-brand-100 bg-white hover:border-brand-300/60 hover:bg-brand-300/10"
            tone="bg-brand-300/15 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white"
          />
        ))}
        <li>
          <StatCard value="30 дней" label={t("programs.pro.proPractice.message1182")} />
        </li>
      </ul>
    </ProgramSection>
  );
}
