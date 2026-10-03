import GuideIcon, { type GuideIconName } from "./guide-icon";

const seasons = ["fall", "winter", "spring", "summer"] as const;

export type SeasonName = (typeof seasons)[number];

const falling: Record<"fall" | "winter", { icon: GuideIconName; motion: string; pieces: { left: string; delay: string; duration: string; drift: string; size: string }[] }> = {
  fall: {
    icon: "leaf",
    motion: "season-fall",
    pieces: [
      { left: "74%", delay: "0s", duration: "4.6s", drift: "1.4rem", size: "size-16" },
      { left: "90%", delay: "1.1s", duration: "5.2s", drift: "-1rem", size: "size-12" },
      { left: "58%", delay: "1.5s", duration: "4.2s", drift: "2rem", size: "size-20" },
      { left: "81%", delay: "3.2s", duration: "4.4s", drift: "-1.6rem", size: "size-14" },
      { left: "66%", delay: "3.6s", duration: "4.8s", drift: "0.4rem", size: "size-16" },
      { left: "95%", delay: "4s", duration: "3.6s", drift: "-2rem", size: "size-12" },
    ],
  },
  winter: {
    icon: "snowflake",
    motion: "season-snow",
    pieces: [
      { left: "70%", delay: "0s", duration: "5.4s", drift: "0.6rem", size: "size-10" },
      { left: "88%", delay: "0.9s", duration: "4.8s", drift: "-1.1rem", size: "size-8" },
      { left: "54%", delay: "1.3s", duration: "6s", drift: "1.4rem", size: "size-12" },
      { left: "79%", delay: "2.9s", duration: "4.4s", drift: "-0.4rem", size: "size-10" },
      { left: "63%", delay: "3.4s", duration: "5.2s", drift: "1rem", size: "size-8" },
      { left: "94%", delay: "3.8s", duration: "4s", drift: "-1.5rem", size: "size-12" },
    ],
  },
};

const blooms = ["top-6 right-8", "top-1/4 right-1/4", "top-1/2 right-12", "bottom-1/4 right-1/3", "bottom-6 right-1/6"];

export default function SeasonEffect({ season }: { season: SeasonName }) {
  return (
    <div aria-hidden="true" className="season-effects pointer-events-none absolute inset-0 overflow-hidden text-white/80">
      {(season === "fall" || season === "winter") &&
        falling[season].pieces.map((piece) => (
          <span
            key={`${piece.left}-${piece.delay}`}
            className={`absolute ${falling[season].motion}`}
            style={{ left: piece.left, ["--fall-delay" as string]: piece.delay, ["--fall-duration" as string]: piece.duration, ["--drift" as string]: piece.drift }}
          >
            <GuideIcon name={falling[season].icon} className={piece.size} />
          </span>
        ))}
      {season === "spring" &&
        blooms.map((place, index) => (
          <span key={place} className={`absolute ${place} season-bloom`} style={{ animationDelay: `${index * 0.25}s` }}>
            <GuideIcon name="flower" className="size-16" />
          </span>
        ))}
      {season === "summer" && (
        <span className="absolute top-4 right-4 grid size-32 place-items-center sm:top-6 sm:right-6">
          <span className="season-glow absolute inset-0 rounded-full bg-white/40" />
          <GuideIcon name="sun" className="season-sun relative size-28" />
        </span>
      )}
    </div>
  );
}
