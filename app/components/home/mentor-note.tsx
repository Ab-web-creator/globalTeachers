import Image from "next/image";

export default function MentorNote() {
  return (
    <section aria-labelledby="mentor-note-title" className="bg-linear-to-br from-sky-100 via-blue-50 to-violet-100 px-6 sm:px-10 lg:px-16 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto grid max-w-400 items-center gap-8 lg:grid-cols-2 lg:gap-16 xl:gap-20">
        <div data-reveal className="relative mx-auto hidden w-full max-w-sm px-5 py-6 lg:block">
          <div aria-hidden="true" className="absolute inset-8 rotate-3 rounded-3xl bg-brand-300/20" />
          <figure className="relative -rotate-3 rounded-xl bg-white p-3 shadow-xl shadow-brand-950/10">
            <div className="relative aspect-4/5 overflow-hidden rounded-lg">
              <Image src="/images/mentor-portrait-new.webp" alt="Педагог за рабочим столом с ноутбуком" fill sizes="(min-width: 1024px) 320px, 100vw" className="object-cover object-center" />
            </div>
            <figcaption style={{ fontFamily: '"Segoe Print", "Bradley Hand", cursive' }} className="px-2 pt-4 pb-2 text-center text-xl italic leading-relaxed text-brand-600">
              Я тоже начинал<br />с первого шага
            </figcaption>
          </figure>
        </div>
        <div className="order-first lg:order-0">
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
              <div data-reveal className="mt-10">
                <p className="text-sm font-semibold tracking-widest text-neutral-900 uppercase">Основатель TeacherNavigator</p>
                <p className="mt-1 text-base text-neutral-500">Ваш наставник на пути к международной карьере</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
