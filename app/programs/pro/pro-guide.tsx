import { inclusions, preparationQuestions } from "./content";

export default function ProGuide() {
  return (
    <>
      <section aria-labelledby="pro-inclusions" className="rounded-3xl border border-brand-100 bg-white p-6 sm:p-8">
        <h2 id="pro-inclusions" className="text-2xl font-semibold">Что входит в PRO</h2>
        <div className="mt-6 space-y-8">
          {inclusions.map(({ title, paragraphs }) => (
            <div key={title}>
              <h3 className="text-lg font-semibold">{title}</h3>
              <div className="mt-2 space-y-3 leading-relaxed text-neutral-600">
                {paragraphs.map((text) => <p key={text}>{text}</p>)}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section aria-labelledby="pro-support">
        <h2 id="pro-support" className="text-2xl font-semibold">И вы не остаётесь одни после консультации</h2>
        <p className="mt-4 leading-relaxed text-neutral-600">Вопросы обычно появляются именно тогда, когда начинается реальный поиск.</p>
        <p className="mt-4 leading-relaxed text-neutral-600">Поэтому в PRO предусмотрена:</p>
        <h3 className="mt-4 text-lg font-semibold">Поддержка в течение 30 дней</h3>
        <p className="mt-2 leading-relaxed text-neutral-600">Вы сможете обращаться к нам с вопросами по вакансиям, документам, заявкам и подготовке к поиску.</p>
      </section>
      <section aria-labelledby="pro-audience">
        <h2 id="pro-audience" className="text-2xl font-semibold">Кому подходит PRO?</h2>
        <div className="mt-4 space-y-4 leading-relaxed text-neutral-600">
          <p>PRO — для вас, если вы готовы самостоятельно искать вакансии и отправлять заявки, но хотите выйти на международный рынок полностью подготовленным.</p>
          <p>Вам не нужно самостоятельно разбираться:</p>
          <ul className="list-disc space-y-2 pl-5 marker:text-neutral-300">
            {preparationQuestions.map((question) => <li key={question}>{question}</li>)}
          </ul>
          <p className="font-medium text-brand-700">Мы подготовим всё это вместе с вами.</p>
          <p>После этого поиск остаётся в ваших руках — но начинаете вы его уже с профессиональными документами, подготовленным интервью и понятной стратегией.</p>
        </div>
      </section>
    </>
  );
}
