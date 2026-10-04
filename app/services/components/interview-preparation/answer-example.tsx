export default function AnswerExample({ label = "Пример ответа", children }: { label?: string; children: string }) {
  return (
    <figure className="rounded-3xl bg-linear-to-br from-amber-100/80 via-rose-50 to-sky-100/80 p-5 sm:p-8">
      <figcaption className="inline-block rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold tracking-widest text-white uppercase shadow-md shadow-brand-500/25">{label}</figcaption>
      <div className="mt-4 flex items-start gap-5 sm:gap-8">
        <span aria-hidden="true" className="shrink-0 font-serif text-6xl leading-none text-rose-300">“</span>
        <blockquote className="text-lg leading-relaxed text-brand-950 sm:text-xl">{children}</blockquote>
      </div>
    </figure>
  );
}
