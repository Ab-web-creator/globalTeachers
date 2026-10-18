"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import Link from "next/link";
import PageHeader from "../../components/page-header";
import { operator, type LegalBlock, type LegalDocument as Document } from "../content";

function Block({ block }: { block: LegalBlock }) {
  const t = useTranslations();
  if (typeof block === "string") return <p>{t.content(block)}</p>;
  if ("heading" in block) return <p className="pt-2 font-semibold text-brand-950">{t.content(block.heading)}</p>;
  if ("list" in block) {
    return (
      <ul className="list-disc space-y-2 pl-6 marker:text-brand-500">
        {block.list.map((item) => <li key={item}>{t.content(item)}</li>)}
      </ul>
    );
  }
  const { head, rows, foot } = block.table;
  return (
    <div className="overflow-x-auto rounded-2xl border border-brand-100">
      <table className="w-full text-left">
        <thead className="bg-brand-50 text-brand-950">
          <tr>{head.map((cell) => <th key={cell} scope="col" className="px-4 py-3 font-semibold">{t.content(cell)}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} className="border-t border-brand-100">
              {row.map((cell, index) => <td key={index} className={`px-4 py-3 ${index > 0 ? "whitespace-nowrap" : ""}`}>{t.content(cell)}</td>)}
            </tr>
          ))}
        </tbody>
        {foot && (
          <tfoot className="border-t border-brand-200 font-semibold text-brand-950">
            <tr>{foot.map((cell, index) => <td key={index} className="px-4 py-3">{t.content(cell)}</td>)}</tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}

export default function LegalDocument({ document }: { document: Document }) {
  const t = useTranslations();
  return (
    <div className="min-h-dvh bg-white text-brand-950">
      <PageHeader />
      <main className="mx-auto max-w-4xl px-6 py-12 sm:px-10 sm:py-16 lg:py-20">
        <Link href="/" className="text-sm text-brand-600 underline underline-offset-4">{t("legal.legalDocument.message0683")}</Link>
        <h1 className="mt-7 text-3xl font-semibold tracking-tight sm:text-4xl">{t.content(document.title)}</h1>
        <p className="mt-7 text-lg leading-relaxed text-neutral-600">{t.content(document.description)}</p>
        <div className="mt-10 space-y-8">
          {document.sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold sm:text-2xl">{t.content(section.title)}</h2>
              {section.paragraphs.length > 0 && (
                <div className="mt-7 space-y-4 text-base leading-relaxed text-neutral-600">
                  {section.paragraphs.map((block, index) => <Block key={index} block={block} />)}
                </div>
              )}
              {section.subsections?.map((subsection) => (
                <section key={subsection.title} className="mt-7">
                  <h3 className="text-lg font-semibold">{t.content(subsection.title)}</h3>
                  <div className="mt-4 space-y-4 text-base leading-relaxed text-neutral-600">
                    {subsection.paragraphs.map((block, index) => <Block key={index} block={block} />)}
                  </div>
                </section>
              ))}
            </section>
          ))}
        </div>
        <section className="mt-10 rounded-2xl border border-brand-200 bg-brand-50 p-6">
          <h2 className="text-xl font-semibold">{t("legal.legalDocument.message0684")}</h2>
          <div className="mt-7 space-y-3 text-neutral-600">
            <p>{t.content(operator.introduction)}</p>
            <p>Email: <a href={`mailto:${operator.email}`} className="break-all underline underline-offset-4 hover:text-brand-600">{t.content(operator.email)}</a></p>
            <p>{t("legal.legalDocument.message0685")}{" "}<a href={operator.website} className="break-all underline underline-offset-4 hover:text-brand-600">{t.content(operator.website)}</a></p>
            <p>{t.content(operator.registrationNotice)}</p>
          </div>
        </section>
        <nav aria-label={t("legal.legalDocument.message0686")} className="mt-10 flex flex-wrap gap-6 text-sm text-brand-600">
          <Link href="/privacy" className="underline underline-offset-4">{t("home.siteFooter.message0453")}</Link>
          <Link href="/terms" className="underline underline-offset-4">{t("home.siteFooter.message0454")}</Link>
        </nav>
      </main>
    </div>
  );
}
