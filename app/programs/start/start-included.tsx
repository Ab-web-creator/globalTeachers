import { programIconPaths, type ProgramIconName } from "@/app/components/svg";
import IconCard from "../../services/components/icon-card";
import ProgramSection from "../components/program-section";
import { inclusions } from "./content";

const cardColors = {
  profile: {
    surface: "border-brand-200 bg-linear-to-br from-brand-50 to-white hover:border-brand-400",
    icon: "bg-brand-200 text-brand-600",
  },
  globe: {
    surface: "border-sky-200 bg-linear-to-br from-sky-50 to-white hover:border-sky-300",
    icon: "bg-sky-200 text-sky-700",
  },
  chat: {
    surface: "border-accent-200 bg-linear-to-br from-accent-50 to-white hover:border-accent-300",
    icon: "bg-accent-200 text-accent-800",
  },
  checklist: {
    surface: "border-amber-200 bg-linear-to-br from-amber-50 to-white hover:border-amber-300",
    icon: "bg-amber-200 text-amber-800",
  },
  document: {
    surface: "border-rose-200 bg-linear-to-br from-rose-50 to-white hover:border-rose-300",
    icon: "bg-rose-200 text-rose-700",
  },
  search: {
    surface: "border-brand-200 bg-linear-to-br from-brand-50 to-white hover:border-brand-400",
    icon: "bg-brand-200 text-brand-600",
  },
  calendar: {
    surface: "border-accent-200 bg-linear-to-br from-accent-50 to-white hover:border-accent-300",
    icon: "bg-accent-200 text-accent-800",
  },
} satisfies Partial<Record<ProgramIconName, {
  surface: string;
  icon: string;
}>>;

export default function StartIncluded() {
  return (
    <ProgramSection id="start-inclusions" label="Состав программы" title="Что входит в START" fade="violet" fadeDirection="down" fadeQuarterHeight>
      <p className="mt-7 max-w-3xl text-lg leading-relaxed text-neutral-600">Всё необходимое для уверенного старта: оценка вашего опыта, ответы на ключевые вопросы и пошаговый план самостоятельного поиска работы.</p>
      <ul className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {inclusions.map(({ icon, title, text }) => {
          const colors = cardColors[icon as keyof typeof cardColors];
          return (
            <IconCard compact key={title} icon={programIconPaths[icon]} title={title} paragraphs={[text]} surface={colors?.surface} tone={colors?.icon} />
          );
        })}
      </ul>
    </ProgramSection>
  );
}
