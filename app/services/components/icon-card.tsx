import FlowChips from "./flow-chips";
import LineIcon from "./line-icon";

// On phones the icon and heading share a row and the text runs full width below; from sm the icon sits in its own column.
export default function IconCard({ icon, title, paragraphs, tone, surface }: { icon: string; title: string; paragraphs: string[]; tone?: string; surface?: string }) {
  return (
    <li className={`group grid grid-cols-[auto_1fr] content-start items-center gap-x-4 gap-y-3 rounded-3xl border p-6 transition-colors hover:shadow-lg hover:shadow-brand-500/10 sm:items-start sm:gap-x-5 sm:p-8 ${surface ?? "border-brand-100 bg-white hover:border-brand-300"}`}>
      <span aria-hidden="true" className={`flex size-12 shrink-0 items-center justify-center rounded-full sm:row-span-2 ${tone ?? "bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white"}`}>
        <LineIcon path={icon} className="size-6" />
      </span>
      <h3 className="min-w-0 text-base font-semibold leading-relaxed">{title}</h3>
      <div className="col-span-2 min-w-0 space-y-3 sm:col-span-1 sm:col-start-2">
        {paragraphs.map((text) => text.includes("→")
          ? <FlowChips key={text} text={text} />
          : <p key={text} className="leading-relaxed text-neutral-600">{text}</p>)}
      </div>
    </li>
  );
}
