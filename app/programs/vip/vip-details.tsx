import Image from "next/image";
import Link from "next/link";
import type { Program } from "../../components/home/categories/programs";
import VipGuide from "./vip-guide";

export default function VipDetails({ program }: { program: Program }) {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12 sm:px-10 lg:py-20">
      <Link href="/#programs" className="text-brand-500 underline-offset-4 hover:underline">← Все программы</Link>
      <article>
        <header className="mt-8 grid items-center gap-8 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold tracking-widest text-brand-500">VIP</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Вы занимаетесь своей работой. Мы помогаем вам строить следующую карьеру.</h1>
          </div>
          <Image src={program.image} alt={program.alt} width={900} height={600} sizes="(min-width: 1024px) 50vw, 100vw" className="aspect-video w-full rounded-3xl object-cover" />
        </header>
        <div className="mx-auto mt-12 max-w-3xl space-y-10 sm:space-y-12">
          <div className="space-y-4 leading-relaxed text-neutral-600">
            <p>Поиск работы в международной школе — это не один отклик и не одно собеседование.</p>
            <p>Это месяцы, в течение которых появляются вакансии, меняются планы, приходят ответы от школ, назначаются интервью, запрашиваются документы и возникают предложения, которые нужно оценивать.</p>
            <p>Можно пройти весь этот путь самостоятельно.</p>
            <p>А можно пройти его вместе с человеком, который знает этот процесс изнутри.</p>
            <p className="text-lg font-medium text-brand-700">Именно для этого создан VIP.</p>
          </div>
          <VipGuide />
          <section aria-labelledby="vip-next-step" className="rounded-3xl border border-brand-100 bg-white p-6 sm:p-8">
            <h2 id="vip-next-step" className="text-2xl font-semibold">VIP — персональное сопровождение</h2>
            <p className="mt-4 text-lg font-medium">От решения искать работу за рубежом — до предложения от международной школы.</p>
            <div className="mt-4 space-y-4 leading-relaxed text-neutral-600">
              <p>Вы продолжаете жить, работать и заниматься своими делами.</p>
              <p>А когда международный поиск требует следующего шага — мы проходим его вместе с вами.</p>
            </div>
            <Link href="/consultation" className="action-gradient mt-6 inline-flex items-center gap-3 rounded-2xl px-6 py-3 font-semibold text-white sm:rounded-full">Выбрать VIP <span aria-hidden="true">→</span></Link>
          </section>
        </div>
      </article>
    </main>
  );
}
