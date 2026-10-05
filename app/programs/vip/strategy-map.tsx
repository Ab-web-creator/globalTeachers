import LineIcon from "../../services/components/line-icon";
import { icons } from "../components/icons";
import { strategy } from "./content";

const points = [
  { icon: icons.globe, tone: "bg-sky-100 text-sky-700", position: "sm:col-start-1 sm:row-start-1" },
  { icon: icons.school, tone: "bg-brand-300/15 text-brand-600", position: "sm:col-start-3 sm:row-start-1" },
  { icon: icons.target, tone: "bg-accent-100 text-accent-700", position: "sm:col-start-1 sm:row-start-2" },
  { icon: icons.calendar, tone: "bg-amber-100 text-amber-700", position: "sm:col-start-1 sm:row-start-3" },
  { icon: icons.document, tone: "bg-rose-100 text-rose-700", position: "sm:col-start-3 sm:row-start-2" },
  { icon: "m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z", tone: "bg-brand-300/15 text-brand-600", position: "sm:col-start-3 sm:row-start-3" },
];

export default function StrategyMap() {
  return (
    <div className="rounded-3xl border border-brand-200/60 bg-linear-to-br from-white via-brand-300/5 to-sky-50/60 p-5 sm:p-6">
      <p className="mb-5 text-xs font-semibold tracking-widest text-brand-500">ОПРЕДЕЛЯЕМ ВМЕСТЕ</p>
      <div className="relative isolate">
        <svg aria-hidden="true" viewBox="0 0 600 450" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 -z-10 hidden h-full w-full text-brand-300/40 sm:block" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M300 225C210 225 240 75 100 75 M300 225C390 225 360 75 500 75 M100 225H500 M300 225C210 225 240 375 100 375 M300 225C390 225 360 375 500 375" />
        </svg>
        <div className="mb-5 flex items-center justify-center gap-3 rounded-2xl border border-brand-300/40 bg-white px-4 py-5 text-brand-600 shadow-sm sm:absolute sm:top-1/2 sm:left-1/2 sm:z-10 sm:mb-0 sm:w-40 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:flex-col sm:text-center">
          <LineIcon path={icons.profile} className="size-8" />
          <span className="text-sm font-semibold">Ваш профиль</span>
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-6">
          {strategy.items.map((text, index) => (
            <li key={text} className={`flex flex-col items-center gap-3 rounded-2xl bg-white/90 p-3 text-center ${points[index].position}`}>
              <span aria-hidden="true" className={`flex size-12 items-center justify-center rounded-2xl ${points[index].tone}`}>
                <LineIcon path={points[index].icon} className="size-6" />
              </span>
              <span className="text-sm leading-normal text-neutral-700 first-letter:uppercase">{text.replace(/[;.]$/, "")}</span>
            </li>
          ))}
        </ul>
      </div>
      <div aria-hidden="true" className="mx-auto my-4 h-8 w-px bg-brand-300" />
      <div className="flex items-center justify-center gap-3 rounded-2xl bg-brand-500 px-5 py-4 text-white shadow-lg shadow-brand-500/15">
        <LineIcon path="M4 20V14 M10 20V9 M16 20V4 M3 21h18" className="size-6" />
        <p className="text-base font-semibold">Персональная стратегия поиска</p>
      </div>
    </div>
  );
}
