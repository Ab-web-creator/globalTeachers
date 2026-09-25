export type AchievementKind = "trophy" | "medal" | "flag";

const paths: Record<AchievementKind, string> = {
  trophy: "M8 8a4 4 0 1 0 8 0 4 4 0 0 0-8 0ZM4 21v-2a6 6 0 0 1 6-6m4 0a6 6 0 0 1 6 6v2",
  medal: "M14 2H5v20h14V7l-5-5ZM14 2v5h5M8 12h8M8 16h6",
  flag: "M5 21V3m0 1c5-4 9 4 14 0v10c-5 4-9-4-14 0",
};

export default function AchievementIcon({ kind }: { kind: AchievementKind }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-7 shrink-0 text-brand-500" aria-hidden="true">
      <path d={paths[kind]} />
    </svg>
  );
}
