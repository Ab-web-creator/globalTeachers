import { searchTiming } from "./content";
import GuideIcon, { type GuideIconName } from "./guide-icon";

const icons: GuideIconName[] = ["leaf", "snowflake", "flower", "sun"];
const lastIndex = searchTiming.length - 1;

function linePlacement(index: number) {
  if (index === 0) return "col-span-2 left-2 right-0";
  if (index === lastIndex) return "col-start-1 col-end-2 inset-x-0";
  return "col-span-2 inset-x-0";
}

function dotPlacement(index: number) {
  if (index === 0) return "justify-self-start";
  if (index === lastIndex) return "justify-self-end";
  return "justify-self-center";
}

export default function SeasonTimeline({ active, playing }: { active: number; playing: boolean }) {
  return (
    <div className="pb-4">
      <ol className="grid md:grid-cols-4">
        {searchTiming.map(({ period, text }, index) => {
          const last = index === lastIndex;

          return (
            <li key={period} className="relative flex min-w-0 gap-4 pb-8 last:pb-0 md:grid md:grid-cols-[auto_1fr] md:content-start md:gap-0 md:pb-0">
              {!last && <span aria-hidden="true" className="absolute top-16 bottom-0 left-8 w-px -translate-x-1/2 bg-brand-300 md:hidden" />}
              <div className="relative grid size-16 shrink-0 place-items-center rounded-full border-4 border-brand-300/20 text-brand-500 md:col-start-1 md:row-start-1 md:ml-2 md:justify-self-center">
                <GuideIcon name={icons[index]} className="size-8" />
              </div>
              <div className="relative my-5 hidden h-3 md:col-span-2 md:row-start-2 md:grid md:grid-cols-subgrid">
                <span aria-hidden="true" className={`absolute top-1/2 h-px -translate-y-1/2 bg-brand-300 ${linePlacement(index)}`} />
                <span aria-hidden="true" className={`relative col-start-1 ml-2 size-3 self-center rounded-full bg-brand-500 ${dotPlacement(index)}`} />
              </div>
              <div className="min-w-0 pt-3 md:contents">
                <span className={`inline-block rounded-full bg-brand-300/20 px-3 py-2 text-sm font-medium text-brand-600 md:col-start-1 md:row-start-3 md:ml-2 md:justify-self-start ${playing && index === active ? "period-blink" : ""}`}>{period}</span>
                <p className="mt-3 text-base leading-relaxed text-neutral-600 md:col-span-2 md:row-start-4 md:mt-5 md:px-2">{text}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
