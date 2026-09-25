import AchievementIcon, { type AchievementKind } from "./achievement-icon";
import styles from "./achievement-card.module.css";

type AchievementCardProps = { title: string; description: string; kind: AchievementKind };

export default function AchievementCard({ title, description, kind }: AchievementCardProps) {
  return (
    <li data-reveal="badge" className={`${styles.card} flex items-center gap-3 rounded-full border-2 border-transparent pr-4 pl-6 py-3 shadow-sm sm:gap-4 sm:pr-5 sm:pl-8 sm:py-4`}>
      <AchievementIcon kind={kind} />
      <div>
        <h3 className="text-sm font-medium tracking-tight">{title}</h3>
        <p className="mt-1 text-sm leading-normal text-neutral-600 lg:text-xs">{description}</p>
      </div>
    </li>
  );
}
