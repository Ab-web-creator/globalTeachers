import { cvSections, portfolioItems, reviewQuestions } from "./content";

export default function CvGuide() {
  return (
    <div className="space-y-10 sm:space-y-12">
      <section aria-labelledby="cv-structure">
        <h2 id="cv-structure" className="text-2xl font-semibold sm:text-3xl">Что должно быть в CV?</h2>
        <p className="mt-4 leading-relaxed text-neutral-600">Для международного поиска лучше подготовить CV на английском языке с понятной и логичной структурой.</p>
        <p className="mt-4 text-neutral-600">Обычно в него входят:</p>
        <div className="mt-6 space-y-4">
          {cvSections.map(({ title, text }) => <div key={title} className="rounded-3xl border border-brand-100 bg-white p-6 sm:p-8">
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="mt-3 leading-relaxed text-neutral-600">{text}</p>
          </div>)}
        </div>
      </section>
      <section aria-labelledby="cv-achievements">
        <h2 id="cv-achievements" className="text-2xl font-semibold sm:text-3xl">CV — это не автобиография</h2>
        <p className="mt-4 leading-relaxed text-neutral-600">Не нужно подробно описывать каждую должность и перечислять все обязанности, которые выполняет обычный учитель.</p>
        <p className="mt-4 text-neutral-600">Вместо:</p>
        <blockquote className="mt-3 rounded-2xl bg-white p-5 leading-relaxed text-neutral-600">«Проводил уроки, составлял планы и оценивал учащихся.»</blockquote>
        <p className="mt-4 leading-relaxed text-neutral-600">лучше показать конкретный опыт и ответственность:</p>
        <blockquote className="mt-3 rounded-2xl border-l-4 border-brand-500 bg-brand-50 p-5 leading-relaxed text-brand-700">«Разработал новую программу для Year 7, руководил школьным ансамблем и подготовил учащихся к публичным выступлениям.»</blockquote>
        <p className="mt-4 leading-relaxed text-neutral-600">Ваше CV должно отвечать не только на вопрос «Где вы работали?», но и «Что вы там сделали?»</p>
      </section>
      <section aria-labelledby="teacher-portfolio">
        <h2 id="teacher-portfolio" className="text-2xl font-semibold sm:text-3xl">А что такое Teacher Portfolio?</h2>
        <p className="mt-4 leading-relaxed text-neutral-600">Портфолио дополняет CV и позволяет показать вашу работу более наглядно.</p>
        <p className="mt-4 text-neutral-600">В него могут входить:</p>
        <ul className="mt-4 list-disc space-y-2 pl-6 leading-relaxed text-neutral-600 marker:text-brand-500">
          {portfolioItems.map((text) => <li key={text}>{text}</li>)}
        </ul>
        <p className="mt-4 leading-relaxed text-neutral-600">Портфолио особенно полезно, если вы можете показать результат своей работы, а не только рассказать о нём.</p>
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
