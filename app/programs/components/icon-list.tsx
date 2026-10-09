import { programIconPaths, ProgramListEllipsisIcon, StrokeIcon, type ProgramIconName } from "@/app/components/svg";

export default function IconList({ items, cards = false, outlined = false, bold = false, textSize = "base" }: { items: readonly { label: string; icon: ProgramIconName; tone?: string; }[]; cards?: boolean; outlined?: boolean; bold?: boolean; textSize?: "base" | "lg"; }) {
  return (
    <ul className="mt-10 grid gap-x-12 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(({ label, icon, tone }) => (
        <li key={label} className={`flex items-center gap-4 ${cards ? "rounded-2xl bg-white p-5" : "py-2"} ${outlined ? "border border-neutral-200 shadow-sm" : ""}`}>
          <span aria-hidden="true" className={`flex size-11 shrink-0 items-center justify-center rounded-full ${tone ?? "bg-brand-100/60 text-brand-600"}`}>
            {icon === "more" ? (
              <ProgramListEllipsisIcon />
            ) : <StrokeIcon path={programIconPaths[icon]} className="size-5" />}
          </span>
          <span className={`${textSize === "lg" ? "text-lg" : "text-base"} leading-snug text-neutral-700 first-letter:uppercase ${bold ? "font-bold" : ""}`}>{label}</span>
        </li>
      ))}
    </ul>
  );
}
