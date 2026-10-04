import LineIcon from "../../services/components/line-icon";
import { icons, type IconName } from "./icons";

// A grid of small tiles, each an icon above a short label.
export default function IconTiles({ title, items }: { title?: string; items: readonly { label: string; icon: IconName }[] }) {
  return (
    <div className="rounded-3xl border border-brand-100 bg-white/80 p-5 sm:p-6">
      {title && <p className="mb-4 text-lg font-semibold text-brand-950">{title}</p>}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map(({ label, icon }) => (
          <li key={label} className="flex flex-col items-start gap-3 rounded-2xl bg-brand-50/60 p-4">
            <span aria-hidden="true" className="flex size-10 items-center justify-center rounded-full bg-white text-brand-500">
              <LineIcon path={icons[icon]} />
            </span>
            <span className="text-sm leading-snug text-neutral-700 first-letter:uppercase">{label.replace(/[;.]$/, "")}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
