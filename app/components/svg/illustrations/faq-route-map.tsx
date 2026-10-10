import type { SVGProps } from "react";
import { worldDotsCities as city, worldDotsPath, worldDotsViewBox } from "../data/world-dots";

type Point = readonly [number, number];
type CityName = keyof typeof city;

const routes: [CityName, CityName][] = [
  ["tashkent", "london"],
  ["tashkent", "dubai"],
  ["tashkent", "bangkok"],
  ["tashkent", "singapore"],
  ["almaty", "shanghai"],
  ["almaty", "seoul"],
  ["moscow", "london"],
  ["moscow", "doha"],
];

const origins: CityName[] = ["tashkent", "almaty", "moscow"];

const labels: { name: CityName; text: string; dx: number; dy: number; anchor?: "start" | "middle" | "end" }[] = [
  { name: "london", text: "Лондон", dx: 0, dy: -12 },
  { name: "dubai", text: "Дубай", dx: 10, dy: 18, anchor: "start" },
  { name: "doha", text: "Доха", dx: -10, dy: 18, anchor: "end" },
  { name: "bangkok", text: "Бангкок", dx: -10, dy: 4, anchor: "end" },
  { name: "singapore", text: "Сингапур", dx: 10, dy: 4, anchor: "start" },
  { name: "shanghai", text: "Шанхай", dx: 10, dy: 4, anchor: "start" },
  { name: "seoul", text: "Сеул", dx: 10, dy: 4, anchor: "start" },
];

// Arc each route upwards in proportion to its length, like a flight path.
function routePath([x1, y1]: Point, [x2, y2]: Point) {
  const lift = Math.hypot(x2 - x1, y2 - y1) * 0.28;
  return `M${x1} ${y1}Q${(x1 + x2) / 2} ${Math.min(y1, y2) - lift} ${x2} ${y2}`;
}

export function FaqRouteMapIllustration(props: Omit<SVGProps<SVGSVGElement>, "children">) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={worldDotsViewBox} aria-hidden="true" {...props}>
      <path d={worldDotsPath} className="stroke-brand-300/45" strokeWidth="5" strokeLinecap="round" />
      <g fill="none" strokeLinecap="round">
        {routes.map(([from, to]) => (
          <path key={`${from}-${to}`} d={routePath(city[from], city[to])} className="stroke-brand-400" strokeWidth="1.6" strokeDasharray="1 6" />
        ))}
      </g>
      {routes.map(([, to]) => to).filter((name, index, all) => all.indexOf(name) === index).map((name) => (
        <g key={name}>
          <circle cx={city[name][0]} cy={city[name][1]} r="9" className="fill-brand-400/20" />
          <circle cx={city[name][0]} cy={city[name][1]} r="3.5" className="fill-brand-500" />
        </g>
      ))}
      {origins.map((name) => (
        <g key={name}>
          <circle cx={city[name][0]} cy={city[name][1]} r="14" className="fill-brand-500/15" />
          <circle cx={city[name][0]} cy={city[name][1]} r="5" className="fill-white stroke-brand-500" strokeWidth="2.5" />
        </g>
      ))}
      <g className="fill-neutral-500" fontFamily="Arial, Helvetica, sans-serif" fontSize="13" letterSpacing="0.3">
        {labels.map(({ name, text, dx, dy, anchor = "middle" as const }) => (
          <text key={name} x={city[name][0] + dx} y={city[name][1] + dy} textAnchor={anchor}>{text}</text>
        ))}
      </g>
    </svg>
  );
}
