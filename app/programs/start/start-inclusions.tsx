import IconCard from "../../services/components/icon-card";
import { icons, type IconName } from "../components/icons";
import { inclusions } from "./content";

const cardColors = {
  profile: {
    surface: "border-brand-200 bg-linear-to-br from-brand-100 to-white hover:border-brand-400",
    icon: "bg-brand-200 text-brand-600",
  },
  globe: {
    surface: "border-sky-200 bg-linear-to-br from-sky-100 to-sky-50 hover:border-sky-300",
    icon: "bg-sky-200 text-sky-700",
  },
  chat: {
    surface: "border-accent-200 bg-linear-to-br from-accent-100 to-accent-50 hover:border-accent-300",
    icon: "bg-accent-200 text-accent-800",
  },
  checklist: {
    surface: "border-amber-200 bg-linear-to-br from-amber-100 to-amber-50 hover:border-amber-300",
    icon: "bg-amber-200 text-amber-800",
  },
  document: {
    surface: "border-rose-200 bg-linear-to-br from-rose-100 to-rose-50 hover:border-rose-300",
    icon: "bg-rose-200 text-rose-700",
  },
  search: {
    surface: "border-brand-200 bg-linear-to-br from-brand-100 to-brand-50 hover:border-brand-400",
    icon: "bg-brand-200 text-brand-600",
  },
  calendar: {
    surface: "border-accent-200 bg-linear-to-br from-accent-100 to-white hover:border-accent-300",
    icon: "bg-accent-200 text-accent-800",
  },
} satisfies Partial<Record<IconName, { surface: string; icon: string }>>;

export default function StartInclusions() {
  return (
    <ul className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {inclusions.map(({ icon, title, text }) => {
        const colors = cardColors[icon as keyof typeof cardColors];

        return (
          <IconCard
            key={title}
            icon={icons[icon]}
            title={title}
            paragraphs={[text]}
            surface={colors?.surface}
            tone={colors?.icon}
          />
        );
      })}
    </ul>
  );
}
