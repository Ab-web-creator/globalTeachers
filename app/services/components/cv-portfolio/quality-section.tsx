import IconPanel from "./icon-panel";
import ReviewChecklist from "./review-checklist";

export default function QualitySection() {
  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2 bg-linear-to-r from-blue-50 to-violet-100">
      <div className="mx-auto grid max-w-400 gap-6 px-6 py-8 sm:px-10 lg:grid-cols-2 lg:px-16 lg:py-10 xl:px-20">
        <ReviewChecklist />
        <IconPanel id="portfolio-quality" title="Главное — качество, а не количество" icon="gem">
          <p className="mt-5 max-w-[64ch] leading-relaxed text-neutral-600">Не стоит собирать десятки страниц документов и фотографий только для того, чтобы портфолио выглядело большим.</p>
          <p className="mt-3 max-w-[64ch] leading-relaxed text-neutral-600">Каждый материал должен помогать школе лучше понять вас как специалиста.</p>
          <p className="mt-6 text-base font-medium leading-relaxed text-brand-600">CV говорит о вашем опыте. Портфолио показывает его.</p>
        </IconPanel>
      </div>
    </div>
  );
}
