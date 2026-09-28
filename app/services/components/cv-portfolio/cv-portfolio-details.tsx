import Link from "next/link";
import ServiceIllustration from "../../../components/service-illustration";
import type { Service } from "../../services";
import { introduction } from "./content";
import CvGuide from "./cv-guide";

export default function CvPortfolioDetails({ service }: { service: Service }) {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12 sm:px-10 lg:py-20">
      <Link href="/#categories" className="text-brand-500 underline-offset-4 hover:underline">← Как мы помогаем</Link>
      <article>
        <header className="mt-8 grid items-center gap-8 md:grid-cols-[1.5fr_1fr]">
          <div>
            <p className="text-sm font-semibold tracking-widest text-brand-500 uppercase">CV и портфолио</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Как представить свой опыт международной школе?</h1>
            {introduction.map((text) => <p key={text} className="mt-4 text-lg leading-relaxed text-neutral-600">{text}</p>)}
          </div>
          <div className="rounded-3xl bg-white p-6">
            <ServiceIllustration bounds={service.imageBounds} className="mx-auto aspect-5/4 w-full max-w-xs overflow-hidden" />
          </div>
        </header>
        <div className="mx-auto mt-12 max-w-3xl space-y-10 sm:space-y-12">
          <CvGuide />
          <section aria-labelledby="cv-pro-support" className="rounded-3xl border border-brand-100 bg-white p-6 sm:p-8">
            <h2 id="cv-pro-support" className="text-2xl font-semibold">Хотите профессионально подготовить CV и портфолио?</h2>
            <p className="mt-4 leading-relaxed text-neutral-600">В программе PRO мы поможем представить ваш опыт в формате, понятном международным школам, подготовить профессиональное CV и собрать Teacher Portfolio.</p>
            <Link href="/programs/pro" className="action-gradient mt-6 inline-flex items-center gap-3 rounded-2xl px-6 py-3 font-medium text-white sm:rounded-full">Посмотреть PRO <span aria-hidden="true">→</span></Link>
          </section>
        </div>
      </article>
    </main>
  );
}
