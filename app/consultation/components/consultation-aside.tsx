"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import { consultationCommunityIconPath, consultationCompassIconPath, ConsultationDetailIcon, consultationLearningIconPath, consultationTravelIconPath } from "@/app/components/svg";

const highlights = [
  { text: "Работа за рубежом", path: consultationTravelIconPath },
  { text: "Международное сообщество", path: consultationCommunityIconPath },
  { text: "Развитие и поддержка", path: consultationLearningIconPath },
  { text: "Понятный путь вперёд", path: consultationCompassIconPath },
];

export default function ConsultationAside() {
  const t = useTranslations();
  return (
    <aside className="hidden min-h-0 self-stretch overflow-y-auto overscroll-contain pt-8 xl:flex xl:flex-col xl:justify-between">
      <p className="border-l border-slate-300 pl-4 text-sm leading-relaxed text-brand-600"><span className="whitespace-nowrap">{t("consultation.consultationAside.message0467")}</span><br />{t("consultation.consultationAside.message0468")}</p>
      <ul className="my-10 space-y-7">
        {highlights.map(({ text, path }) => <li key={text} className="flex items-start gap-3 text-xs leading-relaxed text-slate-600"><ConsultationDetailIcon path={path} />{t.content(text)}</li>)}
      </ul>
      <p className="pb-10 text-lg italic leading-snug text-slate-600">{t("consultation.consultationAside.message0469")}<br />{t("consultation.consultationAside.message0470")}<span className="mt-3 block h-0.5 w-16 -rotate-6 bg-amber-400" /></p>
    </aside>
  );
}
