import CvSupport from "./cv-support";
import IconPanel from "./icon-panel";
import ReviewChecklist from "./review-checklist";

export default function QualitySection() {
  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2 bg-linear-to-b from-violet-100 via-blue-50 via-25% to-transparent to-50%">
      <div className="mx-auto grid max-w-400 px-6 sm:px-10 lg:grid-cols-2 lg:px-16 xl:px-20">
        <section aria-labelledby="cv-review portfolio-quality" className="grid gap-6 lg:col-span-2 lg:grid-cols-2 py-12 sm:py-16 lg:py-20">
          <ReviewChecklist />
          <IconPanel as="div" id="portfolio-quality" title="Главное — качество, а не количество" icon="gem" tone="white">
            <p className="mt-5 max-w-[64ch] text-lg leading-relaxed text-neutral-600">Не стоит собирать десятки страниц документов и фотографий только для того, чтобы портфолио выглядело большим.</p>
            <p className="mt-3 max-w-[64ch] text-lg leading-relaxed text-neutral-600">Каждый материал должен помогать школе лучше понять вас как специалиста.</p>
            <p className="mt-5 border-l-2 border-brand-300 pl-4 text-lg font-medium leading-relaxed text-brand-600">CV говорит о вашем опыте. Портфолио показывает его.</p>
          </IconPanel>
        </section>
        <div className="lg:col-span-2"><CvSupport /></div>
      </div>
    </div>
  );
}
