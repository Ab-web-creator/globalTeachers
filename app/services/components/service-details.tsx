import Link from "next/link";
import ServiceIllustration from "../../components/service-illustration";
import type { Service } from "../services";

export default function ServiceDetails({ service }: { service: Service }) {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12 sm:px-10 lg:py-20">
      <Link href="/#categories" className="text-brand-500 underline-offset-4 hover:underline">← Как мы помогаем</Link>
      <header className="mt-8 grid items-center gap-8 md:grid-cols-[1.5fr_1fr]">
        <div>
          <p className="text-sm font-semibold tracking-widest text-brand-500 uppercase">Ваша международная карьера</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">{service.title}</h1>
          <p className="mt-6 text-lg leading-relaxed text-neutral-600">{service.introduction}</p>
        </div>
        <div className="rounded-3xl bg-white p-6">
          <ServiceIllustration bounds={service.imageBounds} className="mx-auto aspect-5/4 w-full max-w-xs overflow-hidden" />
        </div>
      </header>
      <section aria-labelledby="service-topics" className="mt-12">
        <h2 id="service-topics" className="text-2xl font-semibold">Над чем будем работать</h2>
        <ol className="mt-6 grid gap-5 md:grid-cols-3">
          {service.topics.map(({ title, text }, index) => <li key={title} className="rounded-3xl border border-brand-100 bg-white p-6">
            <span className="flex size-9 items-center justify-center rounded-full bg-brand-50 font-semibold text-brand-500">{index + 1}</span>
            <h3 className="mt-4 text-xl font-medium">{title}</h3>
            <p className="mt-3 leading-relaxed text-neutral-600">{text}</p>
          </li>)}
        </ol>
      </section>
      <section aria-labelledby="service-start" className="mt-10 rounded-3xl bg-white/80 p-6 sm:p-8">
        <h2 id="service-start" className="text-2xl font-semibold">С чего начать</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-neutral-600">{service.preparation}</p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link href="/consultation" className="action-gradient rounded-2xl px-6 py-3 font-medium text-white sm:rounded-full">Получить консультацию</Link>
          <Link href="/#programs" className="action-gradient-outline rounded-2xl px-6 py-3 font-medium sm:rounded-full">Сравнить программы</Link>
        </div>
      </section>
    </main>
  );
}
