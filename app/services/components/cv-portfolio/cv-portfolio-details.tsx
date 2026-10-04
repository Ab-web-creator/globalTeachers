import SectionHeading from "../section-heading";
import Link from "next/link";
import BackLink from "../back-link";
import CvGuide from "./cv-guide";
import CvHero from "./cv-hero";

export default function CvPortfolioDetails() {
  return (
    <main className="mx-auto max-w-400 px-6 pt-6 pb-12 sm:px-10 lg:px-16 lg:pt-8 lg:pb-20 xl:px-20">
      <BackLink />
      <article>
        <CvHero />
        <div className="mt-12 space-y-16 sm:mt-16 sm:space-y-20 lg:mt-20 lg:space-y-24">
          <CvGuide />
          <section aria-labelledby="cv-pro-support" className="rounded-3xl border border-brand-100 bg-white p-6 sm:p-8">
            <SectionHeading id="cv-pro-support">Хотите профессионально подготовить CV и портфолио?</SectionHeading>
            <p className="mt-4 leading-relaxed text-neutral-600">В программе PRO мы поможем представить ваш опыт в формате, понятном международным школам, подготовить профессиональное CV и собрать Teacher Portfolio.</p>
            <Link href="/programs/pro" className="action-gradient mt-6 inline-flex items-center gap-3 rounded-2xl px-6 py-3 font-medium text-white sm:rounded-full">Посмотреть PRO <span aria-hidden="true">→</span></Link>
          </section>
        </div>
      </article>
    </main>
  );
}
