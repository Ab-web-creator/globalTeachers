export default function TopicCard({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <li className="group flex items-start gap-5 rounded-3xl border border-brand-100 bg-white p-6 transition-colors hover:border-brand-300 hover:shadow-lg hover:shadow-brand-500/10 sm:p-8">
      <span aria-hidden="true" className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-6">
          <path d={icon} />
        </svg>
      </span>
      <div className="min-w-0">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-3 max-w-lg leading-relaxed text-neutral-600">{text}</p>
      </div>
    </li>
  );
}
