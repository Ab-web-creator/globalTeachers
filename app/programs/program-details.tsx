import Image from "next/image";
import Link from "next/link";
import type { Program } from "../components/home/categories/programs";

export default function ProgramDetails({ program }: { program: Program }) {
  const services = [...new Set([...program.inheritedServices, ...program.features])];
  if (program.tier === "PRO") {
    services.push("Поможем вам оформить профессиональный профиль в LinkedIn", "Поможем вам подготовить отклики на вакансии международных школ");
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 sm:px-10 lg:py-20">
      <Link href="/#programs" className="text-brand-500 hover:underline">← Все программы</Link>
      <div className="mt-8 grid items-center gap-8 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold tracking-widest text-brand-500">ПАКЕТ {program.tier}</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">{program.title}</h1>
          <p className="mt-6 text-lg leading-relaxed text-neutral-600">{program.description}</p>
          <p className="mt-6 text-2xl font-semibold text-brand-500">{program.price === null ? "Стоимость рассчитывается индивидуально" : `$${program.price} — единоразовая оплата`}</p>
        </div>
        <Image src={program.image} alt={program.alt} width={900} height={600} sizes="(min-width: 1024px) 50vw, 100vw" className="aspect-video w-full rounded-3xl object-cover" />
      </div>
      <section className="mt-12 rounded-3xl border border-brand-100 bg-white p-6 sm:p-8" aria-labelledby="included-title">
        <h2 id="included-title" className="text-2xl font-semibold">Что входит в программу</h2>
        <p className="mt-3 font-medium text-brand-500">{program.supportSummary}</p>
        <ul className="mt-6 list-disc space-y-4 pl-5 text-base leading-relaxed text-neutral-600">
          {services.map((service) => <li key={service}>{service}</li>)}
        </ul>
      </section>
      <section className="mt-10" aria-labelledby="next-step-title">
        <h2 id="next-step-title" className="text-2xl font-semibold">Как начать</h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-neutral-600">На консультации обсудим ваш педагогический опыт, цели и вопросы о программе {program.tier}. Это поможет определить, подходит ли вам этот формат поддержки.</p>
        <Link href="/consultation" className="action-gradient mt-6 inline-flex rounded-2xl px-6 py-3 font-semibold text-white sm:rounded-full">Обсудить программу {program.tier}</Link>
      </section>
    </main>
  );
}
