import { searchTiming, searchTimingIntroduction } from "./content";
import GuideIcon, { type GuideIconName } from "./guide-icon";

const seasons: GuideIconName[] = ["leaf", "snowflake", "flower", "sun"];

export default function SearchTiming() {
  return (
    <section aria-labelledby="search-timing" className="grid gap-8 rounded-3xl bg-linear-to-r from-sky-50 via-brand-300/10 to-brand-300/20 px-6 py-10 sm:px-8 sm:py-12 lg:grid-cols-[2fr_5fr] lg:gap-10 lg:py-14">
      <div className="lg:pt-3">
        <h2 id="search-timing" className="max-w-xs text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">Когда начинать поиск?</h2>
        <p className="mt-4 text-sm leading-relaxed text-neutral-600">{searchTimingIntroduction}</p>
      </div>
      <ol className="grid gap-6 md:grid-cols-4 md:gap-0">
        {searchTiming.map((text, index) => (
          <li key={text} className="relative grid grid-cols-[3.5rem_1fr] gap-4 md:block md:px-3">
            {index < searchTiming.length - 1 && <span aria-hidden="true" className="absolute top-14 bottom-0 left-7 -mb-6 w-px bg-brand-300/50 md:hidden" />}
            <div aria-hidden="true" className="relative mx-auto flex size-14 items-center justify-center rounded-full border border-white/80 bg-white/50 text-brand-500 shadow-sm ring-8 ring-white/20 md:size-16">
              <GuideIcon name={seasons[index]} className="size-8" />
            </div>
            <div aria-hidden="true" className="relative -mx-3 mt-6 mb-7 hidden h-3 items-center justify-center md:flex">
              <span className={`absolute h-px bg-brand-300/60 ${index === 0 ? "right-0 left-1/2" : index === searchTiming.length - 1 ? "right-1/2 left-0" : "inset-x-0"}`} />
              <span className="relative size-3 rounded-full bg-brand-500 ring-4 ring-white/60" />
            </div>
            <p className="text-sm leading-relaxed text-neutral-600">{text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
