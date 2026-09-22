import AchievementCard from "./achievement-card";
import type { AchievementKind } from "./achievement-icon";

const highlights: { kind: AchievementKind; title: string; description: string }[] = [
  { kind: "trophy", title: "Практические рекомендации", description: "от специалиста с международным опытом" },
  { kind: "medal", title: "Подготовка CV, портфолио и интервью", description: "по международным стандартам" },
  { kind: "flag", title: "Индивидуальная стратегия поиска", description: "с учётом вашего опыта и целей" },
];

export default function AboutHighlights() {
  return (
    <ul className="absolute inset-y-0 -right-3 left-12 flex translate-y-10 flex-col justify-center gap-4 sm:-right-8 sm:left-1/3 sm:translate-y-12 sm:gap-5 [&>li]:w-full [&>li:nth-child(2)]:-translate-x-4 sm:[&>li:nth-child(2)]:-translate-x-10">
      {highlights.map((highlight) => (
        <AchievementCard key={highlight.kind} {...highlight} />
      ))}
    </ul>
  );
}
