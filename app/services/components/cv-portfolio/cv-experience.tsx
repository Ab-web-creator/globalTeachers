import SectionHeading from "../section-heading";
import SectionLabel from "../job-search/section-label";
import { experienceExamples, experienceNotes } from "./content";
import ExperienceExample from "./experience-example";

export default function CvExperience() {
  return (
    <section aria-labelledby="cv-achievements">
      <SectionLabel>Как описать опыт</SectionLabel>
      <SectionHeading id="cv-achievements">CV — это не автобиография</SectionHeading>
      <p className="mt-4 max-w-2xl leading-relaxed text-neutral-600">Не нужно подробно описывать каждую должность и перечислять все обязанности, которые выполняет обычный учитель.</p>
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <ExperienceExample tone="weak" label="Вместо:" text={experienceExamples.weak} note={experienceNotes.weak} />
        <ExperienceExample tone="strong" label="Лучше показать конкретный опыт и ответственность:" text={experienceExamples.strong} note={experienceNotes.strong} />
        <div className="-mx-6 flex items-start gap-3 bg-violet-50 p-5 sm:mx-0 sm:items-center sm:gap-5 sm:rounded-3xl sm:p-6">
          <span aria-hidden="true" className="flex size-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-brand-500 sm:size-12">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4 sm:size-6"><path d="M9 18h6m-5 3h4M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 4H9c0-2 0-3-1-4ZM2 8H1m22 0h-1M5 2 4 1m15 1 1-1" /></svg>
          </span>
          <p className="text-base leading-relaxed text-brand-700 sm:text-lg">Ваше CV должно отвечать не только на вопрос «Где вы работали?», но и «Что вы там сделали?»</p>
        </div>
      </div>
    </section>
  );
}
