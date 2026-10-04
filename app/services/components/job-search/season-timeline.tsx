import { searchTiming } from "./content";
import GuideIcon, { type GuideIconName } from "./guide-icon";

const icons: GuideIconName[] = ["leaf", "snowflake", "flower", "sun"];
const lastIndex = searchTiming.length - 1;

// On md each season owns one column, with its icon, dot, badge and text centered on the same axis.
const columns = ["md:col-start-1", "md:col-start-2", "md:col-start-3", "md:col-start-4"];

export default function SeasonTimeline({ active, playing }: { active: number; playing: boolean }) {
  return (
    <div className="pb-4">
      <ol className="grid md:grid-cols-4">
        {searchTiming.map(({ period, text }, index) => {
          const last = index === lastIndex;

          return (
            <li key={period} className="relative flex min-w-0 gap-4 pb-8 last:pb-0 md:contents">
              {!last && <span aria-hidden="true" className="absolute top-16 bottom-0 left-8 w-px -translate-x-1/2 bg-brand-300 md:hidden" />}
              <div className={`relative grid size-16 shrink-0 place-items-center rounded-full border-4 border-brand-300/20 text-brand-500 md:row-start-1 md:justify-self-center ${columns[index]}`}>
                <GuideIcon name={icons[index]} className="size-8" />
              </div>
              <div aria-hidden="true" className={`relative hidden justify-center py-5 md:row-start-2 md:flex ${columns[index]}`}>
                <span className={`absolute top-1/2 h-px bg-brand-300 ${index === 0 ? "left-1/2" : "left-0"} ${last ? "right-1/2" : "right-0"}`} />
                <span className="relative size-3 rounded-full bg-brand-500" />
              </div>
              <div className="min-w-0 pt-3 md:contents">
                <span className={`inline-block rounded-full bg-brand-300/20 px-3 py-2 text-sm font-medium text-brand-600 md:row-start-3 md:justify-self-center ${columns[index]} ${playing && index === active ? "period-blink" : ""}`}>{period}</span>
                <p className={`mt-3 text-base leading-relaxed text-neutral-600 md:row-start-4 md:mt-5 md:px-4 md:text-center ${columns[index]}`}>{text}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
