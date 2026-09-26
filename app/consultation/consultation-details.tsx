const topics = [
  { title: "Ваш опыт и возможности", text: "Обсудим образование, педагогический стаж, знание языков и интересующие вас страны." },
  { title: "Подготовка к поиску", text: "Разберём, на что обратить внимание в CV, портфолио и подготовке к интервью." },
  { title: "Понятный план действий", text: "Определим следующие шаги и подходящий формат поддержки." },
];

export default function ConsultationDetails() {
  return (
    <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
      <section aria-labelledby="consultation-topics">
        <h2 id="consultation-topics" className="text-2xl font-semibold">Что обсудим</h2>
        <ol className="mt-8 space-y-8">
          {topics.map(({ title, text }, index) => (
            <li key={title} className="flex gap-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-600">{index + 1}</span>
              <div><h3 className="text-lg font-medium">{title}</h3><p className="mt-2 leading-relaxed text-neutral-600">{text}</p></div>
            </li>
          ))}
        </ol>
      </section>
      <section aria-labelledby="consultation-contact" className="self-start rounded-3xl border border-brand-200/60 bg-white p-8 sm:p-10">
        <h2 id="consultation-contact" className="text-2xl font-semibold">Начнём с знакомства</h2>
        <p className="mt-5 leading-relaxed text-neutral-600">Напишите, какой предмет вы преподаёте, сколько лет работаете в образовании и куда хотели бы переехать. Добавьте вопросы, которые хотите обсудить.</p>
        <a href="mailto:hello@globalteacherhub.com?subject=Запрос%20на%20консультацию" className="action-gradient-outline mt-8 inline-flex rounded-2xl sm:rounded-full px-6 py-2.5 sm:py-4 text-center font-medium">Написать о консультации</a>
        <p className="mt-4 text-sm leading-relaxed text-neutral-500">Откроется ваша почтовая программа. Адрес для связи: <span className="break-words">hello@globalteacherhub.com</span></p>
      </section>
    </div>
  );
}
