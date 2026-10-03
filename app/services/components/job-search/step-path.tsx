type Direction = "down" | "right" | "left" | "up";

// Steps run in a U-shape on lg (1 ↓ 2 → 3 → 4 ↑ 5), a zigzag on sm and a single column below sm.
export const stepPlacements = [
  "sm:col-start-1 sm:row-start-1 lg:col-start-1 lg:row-start-1",
  "sm:col-start-2 sm:row-start-1 lg:col-start-1 lg:row-start-2",
  "sm:col-start-2 sm:row-start-2 lg:col-start-2 lg:row-start-2",
  "sm:col-start-1 sm:row-start-2 lg:col-start-3 lg:row-start-2",
  "sm:col-start-1 sm:row-start-3 lg:col-start-3 lg:row-start-1",
];

export const stepArrows: { direction: Direction; visibility: string }[][] = [
  [{ direction: "down", visibility: "sm:hidden lg:block" }, { direction: "right", visibility: "hidden sm:block lg:hidden" }],
  [{ direction: "down", visibility: "lg:hidden" }, { direction: "right", visibility: "hidden lg:block" }],
  [{ direction: "down", visibility: "sm:hidden" }, { direction: "left", visibility: "hidden sm:block lg:hidden" }, { direction: "right", visibility: "hidden lg:block" }],
  [{ direction: "down", visibility: "lg:hidden" }, { direction: "up", visibility: "hidden lg:block" }],
  [],
];

const placement: Record<Direction, string> = {
  down: "left-1/2 top-[calc(100%+1rem)] sm:top-[calc(100%+1.5rem)] lg:top-[calc(100%+2rem)]",
  right: "top-1/2 left-[calc(100%+1.5rem)] lg:left-[calc(100%+2rem)]",
  left: "top-1/2 -left-6",
  up: "left-1/2 -top-8",
};

const rotation: Record<Direction, string> = {
  down: "rotate-90",
  right: "",
  left: "rotate-180",
  up: "-rotate-90",
};

export function StepArrow({ direction, className, active }: { direction: Direction; className: string; active: boolean }) {
  return (
    <span aria-hidden="true" className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-brand-200 ${placement[direction]} ${className} ${active ? "step-arrow-blink" : ""}`}>
      <svg viewBox="0 0 24 24" className={`size-8 ${rotation[direction]}`} fill="currentColor"><path d="M8.5 4.5 19 12 8.5 19.5V4.5Z" /></svg>
    </span>
  );
}
