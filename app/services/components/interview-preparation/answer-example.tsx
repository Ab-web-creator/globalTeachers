export default function AnswerExample({ label = "Пример ответа", children }: { label?: string; children: string }) {
  return (
    <figure className="rounded-2xl border border-brand-200 px-5 py-5 sm:px-6 sm:py-6">
      <figcaption className="text-sm font-semibold text-neutral-500">{label}</figcaption>
      <blockquote className="mt-3 text-lg leading-relaxed text-brand-600 sm:text-xl">{children}</blockquote>
    </figure>
  );
}
