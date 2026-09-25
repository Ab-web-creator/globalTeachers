import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "../components/page-header";

export const metadata: Metadata = {
  title: "Вакансии — Global Teacher Hub",
  description: "Работа в международных школах: подготовьтесь к поиску вакансий с Global Teacher Hub.",
};

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-sky-50 via-white to-violet-50 text-brand-700">
      <PageHeader />
      <main className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:py-24">
        <p className="text-sm font-semibold tracking-widest text-brand-500 uppercase">Работа за рубежом</p>
        <h1 className="mt-6 max-w-3xl text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">Вакансии международных школ</h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-neutral-600">Новый этап вашей педагогической карьеры начинается с подходящей возможности.</p>
        <section aria-labelledby="jobs-status" className="mt-12 rounded-3xl border border-brand-200/60 bg-white p-8 sm:p-12">
          <span className="inline-flex rounded-full bg-brand-50 px-4 py-2 text-sm font-medium text-brand-600">Раздел готовится к запуску</span>
          <h2 id="jobs-status" className="mt-6 text-2xl font-semibold sm:text-3xl">Вакансии пока не опубликованы</h2>
          <p className="mt-5 max-w-2xl leading-relaxed text-neutral-600">Пока мы готовим этот раздел, вы можете обсудить свой опыт и цели на консультации. Поможем определить направление поиска и подготовиться к откликам.</p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Link href="/consultation" className="action-gradient-outline inline-flex rounded-full px-6 py-4 text-center font-medium">Получить консультацию</Link>
            <Link href="/#programs" className="font-medium text-brand-500 underline-offset-8 hover:underline">Посмотреть программы</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
