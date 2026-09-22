import AchievementIcon, { type AchievementKind } from "./achievement-icon";

type AchievementCardProps = { title: string; description: string; kind: AchievementKind };

export default function AchievementCard({ title, description, kind }: AchievementCardProps) {
  return (
    <li className="flex items-center gap-3 rounded-2xl bg-brand-50 p-4 shadow-sm sm:gap-4 sm:p-5">
      <AchievementIcon kind={kind} />
      <div>
        <h3 className="text-sm font-medium tracking-tight">{title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-neutral-600">{description}</p>
      </div>
    </li>
  );
}
