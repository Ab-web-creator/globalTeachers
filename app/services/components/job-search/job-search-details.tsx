import Link from "next/link";
import ServiceIllustration from "../../../components/service-illustration";
import type { Service } from "../../services";
import { firstSteps, introduction } from "./content";
import SearchGuide from "./search-guide";

export default function JobSearchDetails({ service }: { service: Service }) {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12 sm:px-10 lg:py-20">
      <Link href="/#categories" className="text-brand-500 underline-offset-4 hover:underline">← Как мы помогаем</Link>
      <article>
        <header className="mt-8 grid items-center gap-8 md:grid-cols-[1.5fr_1fr]">
          <div>
            <p className="text-sm font-semibold tracking-widest text-brand-500 uppercase">Поиск работы за рубежом</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Где искать вакансии в международных школах?</h1>
            <p className="mt-6 text-lg leading-relaxed text-neutral-600">{introduction}</p>
            <p className="mt-4 text-lg font-medium leading-relaxed">Главное — понимать, где искать, когда начинать и на какие позиции откликаться.</p>
          </div>
          <div className="rounded-3xl bg-white p-6">
            <ServiceIllustration bounds={service.imageBounds} className="mx-auto aspect-5/4 w-full max-w-xs overflow-hidden" />
          </div>
        </header>
        <div className="mx-auto mt-12 max-w-3xl space-y-10 sm:space-y-12">
          <SearchGuide />
          <section aria-labelledby="job-search-first-steps">
            <h2 id="job-search-first-steps" className="text-2xl font-semibold sm:text-3xl">С чего начать?</h2>
            <ol className="mt-6 list-decimal space-y-3 pl-6 leading-relaxed text-neutral-600 marker:font-semibold marker:text-brand-500">
              {firstSteps.map((text) => <li key={text} className="pl-2">{text}</li>)}
            </ol>
          </section>
          <section aria-labelledby="job-search-support" className="rounded-3xl border border-brand-100 bg-white p-6 sm:p-8">
            <h2 id="job-search-support" className="text-2xl font-semibold">Не знаете, с каких стран и школ начать?</h2>
            <p className="mt-4 leading-relaxed text-neutral-600">В рамках START мы поможем оценить ваш профиль, определить подходящие направления и составить понятный план самостоятельного поиска.</p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link href="/consultation" className="action-gradient rounded-2xl px-6 py-3 font-medium text-white sm:rounded-full">Получить консультацию</Link>
              <Link href="/#programs" className="action-gradient-outline rounded-2xl px-6 py-3 font-medium sm:rounded-full">Сравнить программы</Link>
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}
