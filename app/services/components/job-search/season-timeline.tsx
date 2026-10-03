import { searchTiming } from "./content";
import GuideIcon, { type GuideIconName } from "./guide-icon";

const icons: GuideIconName[] = ["leaf", "snowflake", "flower", "sun"];

export default function SeasonTimeline({ active, playing }: { active: number; playing: boolean }) {
  return (
    <div className="pb-4">
      <ol className="grid md:grid-cols-4">
        {searchTiming.map(({ period, text }, index) => (
          <li key={period} className="relative flex min-w-0 gap-4 pb-8 last:pb-0 md:block md:pb-0">
            {index < searchTiming.length - 1 && <span aria-hidden="true" className="absolute top-16 bottom-0 left-8 w-px -translate-x-1/2 bg-brand-300 md:hidden" />}
            <div className="relative grid size-16 shrink-0 place-items-center rounded-full border-4 border-brand-300/20 text-brand-500 md:mx-auto">
              <GuideIcon name={icons[index]} className="size-8" />
            </div>
            <div className="relative my-5 hidden h-3 items-center justify-center md:flex">
              <span aria-hidden="true" className={`absolute h-px bg-brand-300 ${index === 0 ? "right-0 left-1/2" : index === searchTiming.length - 1 ? "right-1/2 left-0" : "inset-x-0"}`} />
              <span aria-hidden="true" className="relative size-3 rounded-full bg-brand-500" />
            </div>
            <div className="min-w-0 md:px-2 md:text-center">
              <span className={`inline-block rounded-full bg-brand-300/20 px-3 py-2 text-sm font-medium text-brand-600 ${playing && index === active ? "period-blink" : ""}`}>{period}</span>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600 md:mt-5">{text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
