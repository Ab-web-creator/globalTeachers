import Image from "next/image";
import Link from "next/link";
import type { Program } from "../../components/home/categories/programs";
import StartGuide from "./start-guide";

export default function StartDetails({ program }: { program: Program }) {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12 sm:px-10 lg:py-20">
      <Link href="/#programs" className="text-brand-500 underline-offset-4 hover:underline">← Все программы</Link>
      <article>
        <header className="mt-8 grid items-center gap-8 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold tracking-widest text-brand-500">START</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Поймите, куда двигаться, прежде чем отправлять десятки резюме</h1>
          </div>
          <Image src={program.image} alt={program.alt} width={900} height={600} sizes="(min-width: 1024px) 50vw, 100vw" className="aspect-video w-full rounded-3xl object-cover" />
        </header>
        <div className="mx-auto mt-12 max-w-3xl space-y-10 sm:space-y-12">
          <StartGuide />
          <section aria-labelledby="start-price" className="rounded-3xl border border-brand-100 bg-white p-6 sm:p-8">
            <h2 id="start-price" className="text-4xl font-semibold text-brand-500">${program.price}</h2>
            <p className="mt-4 leading-relaxed text-neutral-600">Иногда один правильно выбранный следующий шаг экономит гораздо больше времени, чем десятки отправленных заявок не туда.</p>
            <p className="mt-4 text-lg font-medium">Начните с понимания своих возможностей.</p>
            <Link href="/consultation" className="action-gradient mt-6 inline-flex items-center gap-3 rounded-2xl px-6 py-3 font-semibold text-white sm:rounded-full">Выбрать START <span aria-hidden="true">→</span></Link>
          </section>
        </div>
      </article>
    </main>
  );
}
