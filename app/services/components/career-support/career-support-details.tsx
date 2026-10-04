import SectionHeading from "../section-heading";
import PageTitle from "../page-title";
import SectionLabel from "../job-search/section-label";
import Link from "next/link";
import ServiceIllustration from "../../../components/service-illustration";
import type { Service } from "../../services";
import { introduction } from "./content";
import SupportGuide from "./support-guide";
import BackLink from "../back-link";

export default function CareerSupportDetails({ service }: { service: Service }) {
  return (
    <main className="mx-auto max-w-400 px-6 pt-6 pb-12 sm:px-10 lg:px-16 lg:pt-8 lg:pb-20 xl:px-20">
      <BackLink />
      <article>
        <header className="mt-8 grid items-center gap-8 md:grid-cols-[1.5fr_1fr]">
          <div>
            <SectionLabel>Карьерное сопровождение</SectionLabel>
            <PageTitle>Когда рядом есть человек, который знает весь процесс</PageTitle>
            {introduction.map((text) => <p key={text} className="mt-4 text-lg leading-relaxed text-neutral-600">{text}</p>)}
          </div>
          <div className="rounded-3xl bg-white p-6">
            <ServiceIllustration bounds={service.imageBounds} className="mx-auto aspect-5/4 w-full max-w-xs overflow-hidden" />
          </div>
        </header>
        <div className="mt-12 max-w-4xl space-y-10 sm:mt-16 sm:space-y-12 lg:mt-20">
          <SupportGuide />
          <section aria-labelledby="career-vip-support" className="rounded-3xl border border-brand-100 bg-white p-6 sm:p-8">
            <SectionHeading id="career-vip-support">Хотите пройти весь путь с персональной поддержкой?</SectionHeading>
            <p className="mt-4 leading-relaxed text-neutral-600">Программа VIP предназначена для педагогов, которым нужна помощь на протяжении всего процесса — от определения стратегии и поиска подходящих вакансий до интервью и получения предложения от международной школы.</p>
            <Link href="/programs/vip" className="action-gradient mt-6 inline-flex items-center gap-3 rounded-2xl px-6 py-3 font-medium text-white sm:rounded-full">Посмотреть VIP <span aria-hidden="true">→</span></Link>
          </section>
        </div>
      </article>
    </main>
  );
}
