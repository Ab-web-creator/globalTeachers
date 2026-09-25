import AchievementIcon, { type AchievementKind } from "./achievement-icon";

type AchievementCardProps = { title: string; description: string; kind: AchievementKind };

export default function AchievementCard({ title, description, kind }: AchievementCardProps) {
  return (
    <li data-reveal="badge" className="flex items-center gap-3 rounded-2xl bg-brand-50 px-4 py-3 shadow-sm sm:gap-4 sm:px-5 sm:py-4">
      <AchievementIcon kind={kind} />
      <div>
        <h3 className="text-sm font-medium tracking-tight">{title}</h3>
        <p className="mt-1 text-sm leading-normal text-neutral-600 lg:text-xs">{description}</p>
      </div>
    </li>
  );
}
