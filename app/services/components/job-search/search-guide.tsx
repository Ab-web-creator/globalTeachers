import { applicationChecks, searchTiming, teachingRoles, vacancySources } from "./content";

export default function SearchGuide() {
  return (
    <div className="space-y-10 sm:space-y-12">
      <section aria-labelledby="vacancy-sources">
        <h2 id="vacancy-sources" className="text-2xl font-semibold sm:text-3xl">Где искать вакансии?</h2>
        <div className="mt-6 space-y-5">
          {vacancySources.map(({ title, text, example }) => (
            <div key={title} className="rounded-3xl border border-brand-100 bg-white p-6 sm:p-8">
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="mt-3 leading-relaxed text-neutral-600">{text}</p>
              {example && <p className="mt-3 leading-relaxed text-brand-600">{example}</p>}
            </div>
          ))}
        </div>
      </section>
      <section aria-labelledby="search-timing">
        <h2 id="search-timing" className="text-2xl font-semibold sm:text-3xl">Когда начинать поиск?</h2>
        {searchTiming.map((text) => <p key={text} className="mt-4 leading-relaxed text-neutral-600">{text}</p>)}
      </section>
      <section aria-labelledby="teaching-roles">
        <h2 id="teaching-roles" className="text-2xl font-semibold sm:text-3xl">Что искать?</h2>
        <p className="mt-4 leading-relaxed text-neutral-600">Названия должностей могут отличаться от привычных вам.</p>
        <p className="mt-4 text-neutral-600">Например:</p>
        <dl className="mt-4 divide-y divide-brand-100 rounded-3xl border border-brand-100 bg-white px-6 sm:px-8">
          {teachingRoles.map(([russian, english]) => (
            <div key={russian} className="grid gap-1 py-4 sm:grid-cols-2 sm:gap-6">
              <dt className="text-neutral-600">{russian}</dt>
              <dd className="font-medium text-brand-600"><span aria-hidden="true">→ </span>{english}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 leading-relaxed text-neutral-600">Поэтому при поиске важно знать международное название своей специальности.</p>
      </section>
      <section aria-labelledby="targeted-applications">
        <h2 id="targeted-applications" className="text-2xl font-semibold sm:text-3xl">Не отправляйте одно резюме всем подряд</h2>
        <p className="mt-4 leading-relaxed text-neutral-600">Количество откликов само по себе не увеличивает шансы получить работу.</p>
        <p className="mt-4 leading-relaxed text-neutral-600">Перед отправкой заявки посмотрите:</p>
        <ul className="mt-4 space-y-3">
          {applicationChecks.map((text) => <li key={text} className="flex gap-3 leading-relaxed text-neutral-600"><span aria-hidden="true" className="text-brand-500">→</span>{text}</li>)}
        </ul>
        <p className="mt-4 leading-relaxed text-neutral-600">Лучше отправить несколько хорошо подготовленных заявок на подходящие позиции, чем десятки одинаковых откликов.</p>
      </section>
    </div>
  );
}
