import { checkListTickIconPath, programIconPaths, StrokeIcon, type ProgramIconName } from "@/app/components/svg";

// A card listing short items, each with a check (or another) icon.
export default function CheckList({ title, items, icon = "checklist", columns = false }: { title?: string; items: readonly string[]; icon?: ProgramIconName; columns?: boolean; }) {
  const path = icon === "checklist" ? checkListTickIconPath : programIconPaths[icon];

  return (
    <div className="rounded-3xl border border-brand-100 bg-white/80 p-6 sm:p-8">
      {title && <p className="mb-5 text-lg font-semibold text-brand-950">{title}</p>}
      <ul className={`grid gap-3 ${columns ? "sm:grid-cols-2 sm:gap-x-8" : ""}`}>
        {items.map((item) => (
          <li key={item} className="flex items-start gap-4">
            <span aria-hidden="true" className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-500">
              <StrokeIcon path={path} className="size-4" />
            </span>
            <span className="leading-relaxed text-neutral-700 first-letter:uppercase">{item.replace(/[;.]$/, "")}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
