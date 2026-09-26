import AchievementIcon, { type AchievementKind } from "./achievement-icon";

type AchievementCardProps = { title: string; description: string; kind: AchievementKind };

export default function AchievementCard({ title, description, kind }: AchievementCardProps) {
  return (
    <li data-reveal="badge" className={`relative flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-5 py-4 shadow-sm sm:gap-4 sm:px-6 ${kind === "medal" ? "invisible -order-1 sm:visible sm:order-none" : ""}`}>
      <AchievementIcon kind={kind} />
      <div>
        <h3 className="text-sm font-medium tracking-tight">{title}</h3>
        <p className="mt-1 text-sm leading-normal text-neutral-600 lg:text-xs">{description}</p>
      </div>
    </li>
  );
}
