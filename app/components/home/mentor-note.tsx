import { Great_Vibes } from "next/font/google";
import QueuedImage from "@/app/components/queued-image";
import { MentorSignatureUnderline } from "@/app/components/svg";

const signatureFont = Great_Vibes({ weight: "400", subsets: ["cyrillic", "latin"], display: "swap", preload: false });

export default function MentorNote() {
  return (
    <section aria-labelledby="mentor-note-title" className="bg-linear-to-br from-orange-50 to-amber-50 sm:from-sky-100 sm:via-blue-50 sm:to-violet-100 px-6 sm:px-10 lg:px-16 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto grid max-w-400 items-center gap-8 lg:grid-cols-5 lg:gap-12 xl:gap-16">
        <div data-reveal className="relative mx-auto hidden w-full max-w-sm px-5 py-6 lg:col-span-2 lg:block">
          <div aria-hidden="true" className="absolute inset-5 translate-x-3 translate-y-2 rotate-1 rounded-3xl bg-purple-100 shadow-md shadow-purple-950/10" />
          <figure className="relative -rotate-3 rounded-xl bg-white p-3 shadow-xl shadow-brand-950/10">
            <div className="relative aspect-4/5 overflow-hidden rounded-lg">
              <QueuedImage src="/images/myImage-brighter-background.webp" alt="Основатель TeacherNavigator за рабочим столом" fill sizes="(min-width: 1024px) 320px, 100vw" className="object-cover object-center brightness-110" />
            </div>
            <figcaption style={{ fontFamily: '"Segoe Print", "Bradley Hand", cursive' }} className="px-2 pt-4 pb-2 text-center text-xl italic leading-relaxed text-brand-600">
              Я тоже начинал<br />с первого шага
            </figcaption>
          </figure>
        </div>
        <div className="order-first lg:order-0 lg:col-span-3">
          <div className="min-w-0 lg:max-w-2xl">
            <header data-reveal>
              <p className="mb-4 text-sm font-semibold tracking-widest text-brand-500 uppercase sm:text-base">
                Лично от основателя
              </p>
              <h2 id="mentor-note-title" className="text-3xl leading-tight font-semibold tracking-wide text-brand-700 sm:text-5xl sm:leading-none md:text-4xl lg:text-balance lg:leading-tight xl:text-5xl 2xl:text-6xl">
                Мой опыт — ваш уверенный путь к успеху
              </h2>
            </header>
            <div className="mt-7 space-y-4 text-base leading-normal text-neutral-700 sm:text-lg lg:space-y-6 lg:leading-relaxed">
              <p data-reveal>
                Когда я только начинал искать работу за рубежом, всё казалось сложным и неопределённым. Резюме, документы, собеседования, визы, контракты — вопросов было много, а понять, с чего начать, было непросто.
              </p>
              <p data-reveal>
          

                <span className="font-semibold text-purple-600 sm:font-normal sm:text-inherit lg:font-semibold lg:text-brand-600">Я прошёл этот путь</span> {' '} самостоятельно и на собственном опыте убедился, насколько важно иметь чёткий план и понимать каждый этап. Именно поэтому я создал {' '} <span className="font-semibold text-purple-600 sm:font-normal sm:text-inherit lg:font-semibold lg:text-brand-600">TeacherNavigator </span> {' '}  — чтобы помочь другим учителям избежать распространённых ошибок и увереннее двигаться к своей цели.

              </p>
              <p data-reveal className="font-semibold text-brand-600 lg:rounded-2xl lg:border-l-4 lg:border-brand-300 lg:bg-white/60 lg:px-6 lg:py-5">
                 {' '} <span className="font-semibold text-purple-600 sm:font-normal sm:text-inherit lg:font-semibold lg:text-brand-600"> Международная карьера учителя — это реальная перспектива. </span> И, возможно, именно сейчас начинается ваша история.
              </p>
            </div>
            <div>
              <div className="mt-9 flex items-start gap-4 sm:hidden">
                <QueuedImage src="/images/myImage-brighter-background.webp" alt="Основатель TeacherNavigator" width={80} height={80} className="size-20 shrink-0 rounded-full object-cover brightness-110" />
                <div className="pt-1">
                  <p className="text-base font-semibold text-brand-700">Основатель<br />TeacherNavigator</p>
                  <p className={`${signatureFont.className} mt-2 text-2xl text-brand-600`}>С вами на каждом этапе</p>
                  <MentorSignatureUnderline />
                </div>
              </div>
              <div data-reveal className="mt-10 hidden sm:block lg:mt-7">
                <p className="text-sm font-semibold tracking-widest text-neutral-900 lg:text-lg">Основатель TeacherNavigator</p>
                <p className="mt-1 text-base text-neutral-500 lg:text-lg">Ваш наставник на пути к международной карьере</p>
                <div className="mt-4 hidden lg:block">
                  <p className={`${signatureFont.className} text-4xl text-brand-600`}>С вами на каждом этапе</p>
                  <MentorSignatureUnderline />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
