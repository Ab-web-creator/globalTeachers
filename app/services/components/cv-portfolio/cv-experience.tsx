"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import { ExperienceIdeaIcon, ExperienceStatusIcon, strongExperienceIconPath, weakExperienceIconPath } from "@/app/components/svg";
import SectionLabel from "../job-search/section-label";
import SectionHeading from "../section-heading";
import { experienceExamples, experienceNotes } from "./content";
import StickyNote from "./sticky-note";

const tones = {
  weak: { box: "bg-rose-50", badge: "bg-rose-500", label: "text-rose-500", dot: "bg-rose-400", icon: weakExperienceIconPath },
  strong: { box: "bg-emerald-50", badge: "bg-emerald-500", label: "text-emerald-600", dot: "bg-emerald-400", icon: strongExperienceIconPath },
};

type Note = {
  sticker: string;
  words: readonly string[];
};

export default function CvExperience() {
  const t = useTranslations();
  return (
    <section aria-labelledby="cv-achievements" className="py-12 sm:py-16 lg:py-20">
      <SectionLabel>{t("services.cvPortfolio.cvExperience.message1472")}</SectionLabel>
      <SectionHeading id="cv-achievements">{t("services.cvPortfolio.cvExperience.message1473")}</SectionHeading>
      <p className="mt-7 max-w-2xl text-lg leading-relaxed text-neutral-600">{t("services.cvPortfolio.cvExperience.message1474")}</p>
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <ExperienceExample tone="weak" label={t("services.cvPortfolio.cvExperience.message1475")} text={experienceExamples.weak} note={experienceNotes.weak} />
        <ExperienceExample tone="strong" label={t("services.cvPortfolio.cvExperience.message1476")} text={experienceExamples.strong} note={experienceNotes.strong} />
        <div className="-mx-6 flex items-start gap-3 bg-violet-50 p-5 sm:mx-0 sm:items-center sm:gap-5 sm:rounded-3xl sm:p-6">
          <span aria-hidden="true" className="flex size-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-brand-500 sm:size-12">
            <ExperienceIdeaIcon />
          </span>
          <p className="text-base leading-relaxed text-brand-700 sm:text-lg">{t("services.cvPortfolio.cvExperience.message1477")}</p>
        </div>
      </div>
    </section>
  );
}

function ExperienceExample({ tone, label, text, note }: {
  tone: keyof typeof tones;
  label: string;
  text: string;
  note?: Note;
}) {
  const t = useTranslations();
  const style = tones[tone];
  return (
    <div className={`-mx-6 flex h-full gap-3 p-5 sm:mx-0 sm:gap-5 sm:rounded-3xl sm:p-6 ${style.box}`}>
      <span aria-hidden="true" className={`flex size-7 shrink-0 items-center justify-center rounded-full text-white sm:size-12 ${style.badge}`}>
        <ExperienceStatusIcon path={style.icon} />
      </span>
      <div className="min-w-0 pt-1 sm:pt-2">
        <p className={`text-sm font-semibold tracking-wide uppercase ${style.label}`}>{t.content(label)}</p>
        <p className="mt-3 text-base leading-relaxed text-neutral-700 sm:text-lg">{t.content(text)}</p>
        {note && (<>
          <div className="mt-6 flex flex-wrap items-start gap-6">
            <ul className="space-y-1 text-base leading-relaxed text-neutral-700 sm:text-lg">
              {note.words.map(word => (<li key={word} className="flex items-center gap-3">
                <span aria-hidden="true" className={`size-1.5 shrink-0 rounded-full ${style.dot}`} />
                {t.content(word)}
              </li>))}
            </ul>
            <StickyNote tone={tone}>{t.content(note.sticker)}</StickyNote>
          </div>
        </>)}
      </div>
    </div>
  );
}
