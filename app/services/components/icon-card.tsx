import FlowChips from "./flow-chips";
import LineIcon from "./line-icon";

export default function IconCard({ icon, title, paragraphs }: { icon: string; title: string; paragraphs: string[] }) {
  return (
    <li className="group flex items-start gap-5 rounded-3xl border border-brand-100 bg-white p-6 transition-colors hover:border-brand-300 hover:shadow-lg hover:shadow-brand-500/10 sm:p-8">
      <span aria-hidden="true" className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white">
        <LineIcon path={icon} className="size-6" />
      </span>
      <div className="min-w-0 space-y-3">
        <h3 className="text-xl font-semibold">{title}</h3>
        {paragraphs.map((text) => text.includes("→")
          ? <FlowChips key={text} text={text} />
          : <p key={text} className="leading-relaxed text-neutral-600">{text}</p>)}
      </div>
    </li>
  );
}
