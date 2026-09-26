import type { PanelProps } from "./content";

export default function MentorNote({ openPanel }: PanelProps) {
  return (
    <section aria-labelledby="mentor-note-title" className="bg-linear-to-br from-sky-100 via-blue-50 to-violet-100 px-6 py-10 sm:px-10 sm:py-12 lg:py-20 xl:py-24 lg:px-16">
      <div className="mx-auto max-w-3xl">
        <header data-reveal>
        <p className="mb-4 text-sm font-semibold tracking-widest text-brand-500 uppercase sm:mb-6 sm:text-base">
          Лично от основателя
        </p>
        <h2 id="mentor-note-title" className="text-4xl leading-none font-semibold tracking-wide text-brand-700 sm:text-5xl md:text-4xl xl:text-5xl 2xl:text-6xl">
          Вы не одни на этом пути
        </h2>
        </header>
        <div className="mt-6 sm:mt-8 space-y-4 text-base leading-normal text-neutral-700 sm:text-lg">
          <p data-reveal>
            Поиск работы за рубежом может казаться сложным и даже нереальным. Резюме, документы, собеседования, визы, контракты — иногда трудно понять, с чего начать.
          </p>
          <p data-reveal>
            Я сам прошёл этот путь и знаю: двигаться вперёд проще, когда есть понятный план и поддержка. Я помогу вам подготовиться к каждому этапу, избежать распространённых ошибок и разобраться с вопросами по ходу дела.
          </p>
          <p data-reveal className="font-semibold text-brand-600">
            Работа учителем за рубежом реальна. Возможно, именно сейчас начинается ваша международная история.
          </p>
        </div>
        <div data-reveal className="mt-6 border-l-2 border-brand-300 pl-4">
          <p className="text-base font-medium text-brand-700">Основатель GlobalTeacherHub</p>
          <p className="mt-1 text-sm text-neutral-600">Ваш наставник на пути к международной карьере</p>
        </div>
        <button
          data-reveal
          type="button"
          onClick={() => openPanel("Consultation")}
          className="mt-12 rounded-2xl sm:rounded-full action-gradient px-6 py-2.5 sm:py-4 text-base font-medium text-white transition hover:action-gradient sm:px-8"
        >
          Обсудить мой следующий шаг
        </button>
      </div>
    </section>
  );
}
