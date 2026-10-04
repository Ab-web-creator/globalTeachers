import SectionHeading from "../section-heading";
import { interviewQuestions, interviewTopics } from "./content";

export default function InterviewConversation() {
  return (
    <div className="space-y-10 sm:space-y-12">
      <section aria-labelledby="interview-topics">
        <SectionHeading id="interview-topics">Что могут спросить?</SectionHeading>
        <p className="mt-4 leading-relaxed text-neutral-600">Вопросы зависят от школы и должности, но чаще всего затрагивают несколько основных тем.</p>
        <div className="mt-6 space-y-4">
          {interviewTopics.map(({ title, text }) => <div key={title} className="rounded-3xl border border-brand-100 bg-white p-6 sm:p-8">
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="mt-3 leading-relaxed text-neutral-600">{text}</p>
          </div>)}
        </div>
      </section>
      <section aria-labelledby="research-school">
        <SectionHeading id="research-school">Почему именно эта школа?</SectionHeading>
        <p className="mt-4 leading-relaxed text-neutral-600">Один из самых важных этапов подготовки — изучить школу до интервью.</p>
        <p className="mt-4 leading-relaxed text-neutral-600">Посмотрите её сайт, curriculum, возраст учащихся, ценности, extracurricular programme и последние новости.</p>
        <p className="mt-4 text-neutral-600">Ответ:</p>
        <blockquote className="mt-3 rounded-2xl bg-white p-5 leading-relaxed text-neutral-600">«Я хочу работать в международной школе и жить за границей»</blockquote>
        <p className="mt-4 leading-relaxed text-neutral-600">говорит в основном о ваших целях.</p>
        <p className="mt-4 leading-relaxed text-neutral-600">Школе гораздо интереснее услышать, почему вас заинтересовала именно она и что вы можете ей предложить.</p>
      </section>
      <section aria-labelledby="interview-examples">
        <SectionHeading id="interview-examples">Говорите примерами</SectionHeading>
        <p className="mt-4 leading-relaxed text-neutral-600">Старайтесь не ограничиваться общими фразами:</p>
        <blockquote className="mt-3 rounded-2xl bg-white p-5 leading-relaxed text-neutral-600">«Я хорошо работаю в команде».</blockquote>
        <p className="mt-4 leading-relaxed text-neutral-600">Гораздо убедительнее рассказать о конкретной ситуации: какая была задача → что сделали вы → что получилось в результате.</p>
        <p className="mt-4 leading-relaxed text-neutral-600">Так школа видит не характеристику, которую кандидат дал сам себе, а реальный пример его работы.</p>
      </section>
      <section aria-labelledby="unexpected-questions">
        <SectionHeading id="unexpected-questions">Будьте готовы к неожиданным вопросам</SectionHeading>
        <p className="mt-4 text-neutral-600">На интервью могут спросить:</p>
        <ul className="mt-4 list-disc space-y-3 pl-6 leading-relaxed text-neutral-600 marker:text-brand-500">
          {interviewQuestions.map((question) => <li key={question}>{question}</li>)}
        </ul>
        <p className="mt-4 leading-relaxed text-neutral-600">Задача подготовки — не выучить идеальные ответы, а заранее вспомнить реальные ситуации из собственного опыта, которыми вы сможете подкрепить свои слова.</p>
      </section>
    </div>
  );
}
