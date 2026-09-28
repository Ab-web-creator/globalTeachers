import { inclusions, questions } from "./content";

export default function StartGuide() {
  return (
    <>
      <section aria-labelledby="start-questions">
        <h2 id="start-questions" className="text-2xl font-semibold">Вы хотите работать в международной школе, но пока не уверены:</h2>
        <ul className="mt-5 list-disc space-y-2 pl-5 leading-relaxed text-neutral-600 marker:text-neutral-300">
          {questions.map((question) => <li key={question}>{question}</li>)}
        </ul>
        <p className="mt-6 leading-relaxed text-neutral-600">Можно искать ответы самостоятельно — читать форумы, смотреть сотни вакансий и пробовать разобраться в требованиях разных стран и школ.</p>
        <p className="mt-4 text-lg font-medium">А можно сначала понять свою точку старта.</p>
      </section>
      <section aria-labelledby="start-approach">
        <h2 id="start-approach" className="text-2xl font-semibold">Именно для этого создан START</h2>
        <div className="mt-4 space-y-4 leading-relaxed text-neutral-600">
          <p>Мы начинаем не с общих советов, а с вас.</p>
          <p>Разбираем ваше образование, педагогическую квалификацию, стаж, специальность и профессиональный опыт.</p>
          <p>Смотрим, как ваш профиль выглядит с точки зрения международной школы и какие направления стоит рассматривать.</p>
          <p>Затем проводим персональную консультацию 60–90 минут, после которой у вас должен появиться конкретный план действий.</p>
        </div>
        <div className="mt-6 rounded-2xl bg-brand-50 p-5 sm:p-6">
          <p className="font-semibold">Вы будете понимать:</p>
          <p className="mt-2 leading-relaxed text-brand-600">куда подаваться → что подготовить → что улучшить → где искать → что делать дальше.</p>
        </div>
      </section>
      <section aria-labelledby="start-inclusions" className="rounded-3xl border border-brand-100 bg-white p-6 sm:p-8">
        <h2 id="start-inclusions" className="text-2xl font-semibold">Что входит в START</h2>
        <dl className="mt-6 space-y-6">
          {inclusions.map(({ title, text }) => (
            <div key={title}>
              <dt className="text-lg font-semibold">{title}</dt>
              <dd className="mt-2 leading-relaxed text-neutral-600">{text}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section aria-labelledby="start-audience">
        <h2 id="start-audience" className="text-2xl font-semibold">Кому подходит START?</h2>
        <div className="mt-4 space-y-4 leading-relaxed text-neutral-600">
          <p>START — для вас, если вы готовы искать работу самостоятельно, но не хотите начинать вслепую.</p>
          <p>Мы не будем делать весь поиск вместо вас.</p>
          <p>Наша задача — помочь вам избежать хаотичных действий и дать понятное направление, профессиональную оценку и план, с которым вы сможете двигаться дальше самостоятельно.</p>
        </div>
      </section>
    </>
  );
}
