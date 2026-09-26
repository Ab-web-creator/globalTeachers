import AchievementCard from "./achievement-card";
import type { AchievementKind } from "./achievement-icon";

const highlights: { kind: AchievementKind; title: string; description: string }[] = [
  { kind: "trophy", title: "Практические рекомендации", description: "от специалиста с международным опытом" },
  { kind: "medal", title: "Подготовка CV, портфолио и интервью", description: "по международным стандартам" },
  { kind: "flag", title: "Индивидуальная стратегия поиска", description: "с учётом вашего опыта и целей" },
];

export default function AboutHighlights() {
  return (
    <ul className="absolute inset-y-0 inset-x-2 mx-auto flex w-fit translate-y-10 flex-col items-stretch justify-center gap-4 sm:-right-8 sm:left-1/3 sm:mx-0 sm:w-auto sm:translate-y-12 sm:gap-5 sm:max-lg:right-0 sm:max-lg:left-2/5 [&>li]:w-full">
      {highlights.map((highlight) => (
        <AchievementCard key={highlight.kind} {...highlight} />
      ))}
    </ul>
  );
}
