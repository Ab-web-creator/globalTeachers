import AchievementIcon, { type AchievementKind } from "./achievement-icon";

type AchievementCardProps = { title: string; description: string; kind: AchievementKind };

export default function AchievementCard({ title, description, kind }: AchievementCardProps) {
  return (
    <li className="flex items-start gap-3 rounded-2xl bg-brand-50 p-5">
      <AchievementIcon kind={kind} />
      <div>
        <h3 className="text-base font-medium tracking-tight">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-neutral-600">{description}</p>
      </div>
    </li>
  );
}
