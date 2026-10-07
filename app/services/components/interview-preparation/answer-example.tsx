export default function AnswerExample({ label = "Пример ответа", children }: { label?: string; children: string }) {
  return (
    <figure className="rounded-r-2xl border-l-2 border-brand-400 bg-neutral-50 px-5 py-5 sm:px-6 sm:py-6">
      <figcaption className="text-sm font-semibold text-neutral-500">{label}</figcaption>
      <blockquote className="mt-3 text-lg leading-relaxed text-brand-600 sm:text-xl">{children}</blockquote>
    </figure>
  );
}
