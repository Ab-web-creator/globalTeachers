import LineIcon from "../../services/components/line-icon";
import { icons, type IconName } from "./icons";

export default function IconList({ items, cards = false, outlined = false, bold = false }: { items: readonly { label: string; icon: IconName; tone?: string }[]; cards?: boolean; outlined?: boolean; bold?: boolean }) {
  return (
    <ul className="mt-10 grid gap-x-12 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(({ label, icon, tone }) => (
        <li key={label} className={`flex items-center gap-4 ${cards ? "rounded-2xl bg-white p-5" : "py-2"} ${outlined ? "border border-neutral-200 shadow-sm" : ""}`}>
          <span aria-hidden="true" className={`flex size-11 shrink-0 items-center justify-center rounded-full ${tone ?? "bg-brand-100/60 text-brand-600"}`}>
            {icon === "more" ? (
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <circle cx="5" cy="12" r="2.2" />
                <circle cx="12" cy="12" r="2.2" />
                <circle cx="19" cy="12" r="2.2" />
              </svg>
            ) : <LineIcon path={icons[icon]} className="size-5" />}
          </span>
          <span className={`text-base leading-snug text-neutral-700 first-letter:uppercase ${bold ? "font-bold" : ""}`}>{label}</span>
        </li>
      ))}
    </ul>
  );
}
