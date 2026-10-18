"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import { preparationCheckIconPath, preparationLightbulbIconPath, programIconPaths, StrokeIcon } from "@/app/components/svg";
import { audience, preparationQuestions, support } from "./content";
import ProFitCard from "./pro-fit-card";

// Support, audience and "what you won't have to figure out" as three blocks in a row.
export default function ProFit() {
  const t = useTranslations();
  return (
    <section aria-labelledby="pro-support pro-audience pro-preparation" className="py-12 sm:py-16 lg:py-20">
      <div className="grid gap-5 lg:grid-cols-3">
        <ProFitCard id="pro-support" title={t("programs.pro.proFit.message1174")} icon={programIconPaths.chat} note="На каждом этапе вы не одни" variant="support">
          {support.paragraphs.map((text) => <p key={text}>{t.content(text)}</p>)}
        </ProFitCard>
        <ProFitCard id="pro-audience" title={t("programs.pro.proFit.message1176")} icon={programIconPaths.profile} note="Больше, чем подготовка" variant="audience">
          {audience.paragraphs.map((text) => <p key={text}>{t.content(text)}</p>)}
        </ProFitCard>
        <ProFitCard id="pro-preparation" title={t.content(audience.listTitle)} icon={preparationLightbulbIconPath} note="Чёткие ответы на важные вопросы" variant="documents">
          <ul className="space-y-3">
            {preparationQuestions.map((text) => (
              <li key={text} className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-200/60 text-brand-500">
                  <StrokeIcon path={preparationCheckIconPath} className="size-3.5" />
                </span>
                <p className="first-letter:uppercase">{t.content(text).replace(/[;.]$/, "")}</p>
              </li>
            ))}
          </ul>
          <p className="border-t border-brand-200/60 pt-5 font-semibold text-brand-600">{t.content(audience.closing)}</p>
        </ProFitCard>
      </div>
    </section>
  );
}
