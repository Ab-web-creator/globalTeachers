import { offerConditions, supportSections } from "./content";

export default function SupportGuide() {
  return (
    <div className="space-y-10 sm:space-y-12">
      {supportSections.map(({ id, title, paragraphs }) => (
        <section key={id} aria-labelledby={id}>
          <h2 id={id} className="text-2xl font-semibold sm:text-3xl">{title}</h2>
          {paragraphs.map((text) => <p key={text} className={`mt-4 leading-relaxed ${text.includes("→") ? "rounded-2xl bg-brand-50 p-5 font-medium text-brand-600" : "text-neutral-600"}`}>{text}</p>)}
        </section>
      ))}
      <section aria-labelledby="support-offer">
        <h2 id="support-offer" className="text-2xl font-semibold sm:text-3xl">Предложение от школы — что дальше?</h2>
        <p className="mt-4 leading-relaxed text-neutral-600">Получить offer — ещё не значит автоматически его принять.</p>
        <p className="mt-4 leading-relaxed text-neutral-600">Важно внимательно посмотреть на весь пакет:</p>
        <ul className="mt-5 grid list-disc gap-x-8 gap-y-3 rounded-3xl border border-brand-100 bg-white py-6 pr-6 pl-10 text-neutral-600 marker:text-brand-500 sm:grid-cols-2 sm:py-8 sm:pr-8 sm:pl-12">
          {offerConditions.map((condition) => <li key={condition}>{condition}</li>)}
        </ul>
        <p className="mt-4 leading-relaxed text-neutral-600">Если одновременно появляются несколько предложений, их нужно спокойно сравнить.</p>
        <p className="mt-4 leading-relaxed text-neutral-600">Мы помогаем разобраться в условиях и подготовить вопросы, которые стоит задать школе перед принятием решения.</p>
      </section>
      <section aria-labelledby="support-relocation">
        <h2 id="support-relocation" className="text-2xl font-semibold sm:text-3xl">И после предложения работа ещё не заканчивается</h2>
        <p className="mt-4 leading-relaxed text-neutral-600">После принятия предложения начинается следующий этап: документы, рабочая виза, подготовка к переезду и коммуникация со школой.</p>
        <p className="mt-4 leading-relaxed text-neutral-600">Оформлением визы и официальных документов обычно занимается работодатель в соответствии с требованиями конкретной страны, однако кандидату необходимо вовремя предоставить нужные документы и выполнить необходимые действия со своей стороны.</p>
        <p className="mt-4 leading-relaxed text-neutral-600">Мы помогаем вам не потеряться в процессе и понимать, что происходит на каждом этапе.</p>
      </section>
      <section aria-labelledby="support-meaning">
        <h2 id="support-meaning" className="text-2xl font-semibold sm:text-3xl">Что значит «сопровождение»?</h2>
        <p className="mt-4 leading-relaxed text-neutral-600">Это не обещание найти работу вместо вас и не гарантия получения предложения.</p>
        <p className="mt-4 text-xl font-medium leading-relaxed text-brand-600">Решение о найме всегда принимает школа.</p>
        <p className="mt-4 leading-relaxed text-neutral-600">Сопровождение означает другое: вы не проходите незнакомый процесс в одиночку. У вас есть стратегия, профессиональная обратная связь и человек, к которому можно обратиться, когда появляется очередной вопрос или необходимо принять решение.</p>
      </section>
    </div>
  );
}
