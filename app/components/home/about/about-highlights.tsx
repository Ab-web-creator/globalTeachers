import AchievementCard from "./achievement-card";

export default function AboutHighlights() {
  return (
    <ul className="grid gap-4 md:grid-cols-3 lg:col-span-2">
      <AchievementCard kind="trophy" title="Практические рекомендации" description="от специалиста с международным опытом" />
      <AchievementCard kind="medal" title="Подготовка CV, портфолио и интервью" description="по международным стандартам" />
      <AchievementCard kind="flag" title="Индивидуальная стратегия поиска" description="с учётом вашего опыта и целей" />
    </ul>
  );
}
