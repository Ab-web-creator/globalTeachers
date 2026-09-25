import BenefitsGrid from "./benefits/benefits-grid";

export default function Benefits() {
  return (
    <section
      id="benefits"
      aria-labelledby="benefits-title"
      className="bg-linear-to-b from-brand-50/60 to-white py-8 sm:py-12"
    >
      <div className="mx-auto w-full max-w-400 px-6 sm:px-10 lg:px-16 xl:px-20">
        <header className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold tracking-widest text-brand-500 uppercase sm:text-base">
            Ваша будущая карьера в цифрах
          </p>
          <h2
            id="benefits-title"
            className="mt-3 text-4xl leading-none font-semibold tracking-tight text-brand-950 sm:text-5xl md:text-4xl xl:text-5xl 2xl:text-6xl"
          >
            $4,000 — это ещё<br className="hidden sm:block" /> не весь доход
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-normal text-neutral-600 sm:text-lg">
            Международные школы предлагают комплексный пакет, который может включать гораздо больше.
          </p>
        </header>
        <BenefitsGrid />
      </div>
    </section>
  );
}
