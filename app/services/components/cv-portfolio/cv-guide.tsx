import SectionLabel from "../job-search/section-label";
import { cvSections, reviewQuestions } from "./content";
import CvExperience from "./cv-experience";
import CvSectionCard from "./cv-section-card";
import PortfolioItems from "./portfolio-items";
import SectionFade from "./section-fade";

export default function CvGuide() {
  return (
    <div className="space-y-16 sm:space-y-20 lg:space-y-24">
      <section aria-labelledby="cv-structure" className="relative isolate pb-12 sm:pb-16 lg:pb-20">
        <SectionFade />
        <SectionLabel>Структура CV</SectionLabel>
        <h2 id="cv-structure" className="text-2xl font-semibold sm:text-3xl">Что должно быть в CV?</h2>
        <p className="mt-4 max-w-lg leading-relaxed text-neutral-600">Для международного поиска лучше подготовить CV на английском языке с понятной и логичной структурой. Обычно в него входят:</p>
        <div className="mt-6 grid gap-4 lg:grid-cols-2 lg:gap-6">
          {cvSections.map((section) => <CvSectionCard key={section.title} {...section} />)}
        </div>
      </section>
      <CvExperience />
      <section aria-labelledby="teacher-portfolio" className="relative isolate pb-12 sm:pb-16 lg:pb-20">
        <SectionFade />
        <SectionLabel>Портфолио</SectionLabel>
        <h2 id="teacher-portfolio" className="text-2xl font-semibold sm:text-3xl">А что такое Teacher Portfolio?</h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-neutral-600">Портфолио дополняет CV и позволяет показать вашу работу более наглядно. Оно особенно полезно, если вы можете показать результат своей работы, а не только рассказать о нём. В него могут входить:</p>
        <PortfolioItems />
      </section>
      <section aria-labelledby="portfolio-quality">
        <h2 id="portfolio-quality" className="text-2xl font-semibold sm:text-3xl">Главное — качество, а не количество</h2>
        <p className="mt-4 leading-relaxed text-neutral-600">Не стоит собирать десятки страниц документов и фотографий только для того, чтобы портфолио выглядело большим.</p>
        <p className="mt-4 leading-relaxed text-neutral-600">Каждый материал должен помогать школе лучше понять вас как специалиста.</p>
        <p className="mt-6 text-xl font-medium leading-relaxed text-brand-600">CV говорит о вашем опыте. Портфолио показывает его.</p>
      </section>
      <section aria-labelledby="cv-review">
        <h2 id="cv-review" className="text-2xl font-semibold sm:text-3xl">Перед отправкой проверьте</h2>
        <ol className="mt-6 space-y-4">
          {reviewQuestions.map((question, index) => <li key={question} className="flex items-baseline gap-4 leading-relaxed text-neutral-600">
            <span aria-hidden="true" className="font-semibold tabular-nums text-brand-500">{String(index + 1).padStart(2, "0")}</span>
            {question}
          </li>)}
        </ol>
      </section>
    </div>
  );
}
