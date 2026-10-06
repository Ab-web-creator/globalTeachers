import MentorSignature from "./mentor-signature";

export default function MentorMessage() {
  return (
      <div className="min-w-0">
        <header data-reveal>
        <p className="mb-4 text-sm font-semibold tracking-widest text-brand-500 uppercase sm:text-base">
          Лично от основателя
        </p>
        <h2 id="mentor-note-title" className="text-4xl leading-none font-semibold tracking-wide text-brand-700 sm:text-5xl md:text-4xl xl:text-5xl 2xl:text-6xl">
          Вы не одни на этом пути
        </h2>
        </header>
        <div className="mt-7 space-y-4 text-base leading-normal text-neutral-700 sm:text-lg">
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
        <div>
          <MentorSignature />
        </div>
      </div>
  );
}
