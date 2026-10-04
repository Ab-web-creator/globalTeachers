import SectionHeading from "../section-heading";
import SectionLabel from "../job-search/section-label";
import { reviewQuestions } from "./content";
import CvExperience from "./cv-experience";
import CvSections from "./cv-sections";
import PortfolioItems from "./portfolio-items";
import QualitySection from "./quality-section";
import SectionFade from "./section-fade";

export default function CvGuide() {
  return (
    <div className="space-y-16 sm:space-y-20 lg:space-y-24">
      <section aria-labelledby="cv-structure" className="relative isolate pb-12 sm:pb-16 lg:pb-20">
        <SectionFade />
        <SectionLabel>Структура CV</SectionLabel>
        <SectionHeading id="cv-structure">Что должно быть в CV?</SectionHeading>
        <p className="mt-4 max-w-lg leading-relaxed text-neutral-600">Для международного поиска лучше подготовить CV на английском языке с понятной и логичной структурой. Обычно в него входят:</p>
        <CvSections />
      </section>
      <CvExperience />
      <div>
        <section aria-labelledby="teacher-portfolio" className="pb-12 sm:pb-16 lg:pb-20">
          <SectionLabel>Портфолио</SectionLabel>
          <SectionHeading id="teacher-portfolio">А что такое Teacher Portfolio?</SectionHeading>
          <p className="mt-4 max-w-2xl leading-relaxed text-neutral-600">Портфолио дополняет CV и позволяет показать вашу работу более наглядно. Оно особенно полезно, если вы можете показать результат своей работы, а не только рассказать о нём. В него могут входить:</p>
          <PortfolioItems />
        </section>
        <QualitySection />
      </div>
      <section aria-labelledby="cv-review">
        <SectionHeading id="cv-review">Перед отправкой проверьте</SectionHeading>
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
