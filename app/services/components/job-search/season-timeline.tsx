import { searchTiming } from "./content";
import GuideIcon, { type GuideIconName } from "./guide-icon";

const icons: GuideIconName[] = ["leaf", "snowflake", "flower", "sun"];
const lastIndex = searchTiming.length - 1;

// On md each season owns three columns (badge, half gap, half gap), so dots sit on column lines between badges.
const columns = [
  { icon: "md:col-start-1 md:col-end-3", badge: "md:col-start-1", text: "md:col-start-1 md:pr-4" },
  { icon: "md:col-start-3 md:col-end-6", badge: "md:col-start-4", text: "md:col-start-4 md:pr-4" },
  { icon: "md:col-start-6 md:col-end-9", badge: "md:col-start-7", text: "md:col-start-7 md:pr-4" },
  { icon: "md:col-start-9 md:col-end-13", badge: "md:col-start-10", text: "md:col-start-10" },
];

const dots = [
  ["md:col-start-1 md:justify-self-start", "md:col-start-2 md:col-end-4 md:justify-self-center"],
  ["md:col-start-5 md:col-end-7 md:justify-self-center"],
  ["md:col-start-8 md:col-end-10 md:justify-self-center"],
  ["md:col-start-12 md:justify-self-end"],
];

export default function SeasonTimeline({ active, playing }: { active: number; playing: boolean }) {
  return (
    <div className="pb-4">
      <ol className="grid md:grid-cols-[repeat(4,auto_1fr_1fr)] md:px-2">
        {searchTiming.map(({ period, text }, index) => {
          const last = index === lastIndex;

          return (
            <li key={period} className="relative flex min-w-0 gap-4 pb-8 last:pb-0 md:contents">
              {!last && <span aria-hidden="true" className="absolute top-16 bottom-0 left-8 w-px -translate-x-1/2 bg-brand-300 md:hidden" />}
              <div className={`relative grid size-16 shrink-0 place-items-center rounded-full border-4 border-brand-300/20 text-brand-500 md:row-start-1 md:justify-self-center ${columns[index].icon}`}>
                <GuideIcon name={icons[index]} className="size-8" />
              </div>
              {last && <span aria-hidden="true" className="hidden h-px bg-brand-300 md:col-span-full md:row-start-2 md:mx-1.5 md:block md:self-center" />}
              {dots[index].map((place) => (
                <span key={place} aria-hidden="true" className={`relative hidden size-3 rounded-full bg-brand-500 md:row-start-2 md:my-5 md:block ${place}`} />
              ))}
              <div className="min-w-0 pt-3 md:contents">
                <span className={`inline-block rounded-full bg-brand-300/20 px-3 py-2 text-sm font-medium text-brand-600 md:row-start-3 md:justify-self-start ${columns[index].badge} ${playing && index === active ? "period-blink" : ""}`}>{period}</span>
                <p className={`mt-3 text-base leading-relaxed text-neutral-600 md:col-span-3 md:row-start-4 md:mt-5 ${columns[index].text}`}>{text}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
