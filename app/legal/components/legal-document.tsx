import Link from "next/link";
import PageHeader from "../../components/page-header";
import { operator, type LegalDocument as Document } from "../content";

export default function LegalDocument({ document }: { document: Document }) {
  return (
    <div className="min-h-dvh bg-white text-brand-950">
      <PageHeader inFlow />
      <main className="mx-auto max-w-4xl px-6 py-12 sm:px-10 sm:py-16 lg:py-20">
        <Link href="/" className="text-sm text-brand-600 underline underline-offset-4">На главную</Link>
        <h1 className="mt-7 text-3xl font-semibold tracking-tight sm:text-4xl">{document.title}</h1>
        <p className="mt-7 text-lg leading-relaxed text-neutral-600">{document.description}</p>
        <aside className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-relaxed text-amber-950">
          Черновик от 8 октября 2026 года. Реквизиты, контакты и отдельные условия требуют подтверждения. Email ниже — пример, а не действующий адрес для обращений.
        </aside>
        <div className="mt-10 space-y-8">
          {document.sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold sm:text-2xl">{section.title}</h2>
              <div className="mt-7 space-y-4 text-base leading-relaxed text-neutral-600">
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </section>
          ))}
        </div>
        <section className="mt-10 rounded-2xl border border-brand-200 bg-brand-50 p-6">
          <h2 className="text-xl font-semibold">Реквизиты и контакты</h2>
          <div className="mt-7 space-y-3 text-neutral-600">
            <p>{operator.name}</p>
            <p>{operator.address}</p>
            <p>Email (пример): {operator.email}</p>
          </div>
        </section>
        <nav aria-label="Правовые документы" className="mt-10 flex flex-wrap gap-6 text-sm text-brand-600">
          <Link href="/privacy" className="underline underline-offset-4">Политика конфиденциальности</Link>
          <Link href="/terms" className="underline underline-offset-4">Пользовательское соглашение</Link>
        </nav>
      </main>
    </div>
  );
}
