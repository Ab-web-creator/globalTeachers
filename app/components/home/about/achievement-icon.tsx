export type AchievementKind = "trophy" | "medal" | "flag";

export default function AchievementIcon({ kind }: { kind: AchievementKind }) {
  return (
    <svg viewBox="0 0 48 56" className="h-10 w-9 shrink-0" aria-hidden="true">
      {kind === "trophy" && <>
        <path d="M11 5h26v10c0 11-6 16-13 16S11 26 11 15Z" className="fill-amber-400" />
        <path d="M11 9H5c-3 12 6 16 12 15M37 9h6c3 12-6 16-12 15M24 30v12" fill="none" className="stroke-amber-400" strokeWidth="3" />
        <path d="M15 42h18v9H15z" className="fill-amber-400 stroke-brand-500" strokeWidth="3" />
        <path d="M11 53h26" className="stroke-brand-500" strokeWidth="3" />
      </>}
      {kind === "medal" && <>
        <path d="m14 28-5 25 10-5 5 6 3-26m-3 0 5 26 5-6 9 5-6-25" className="fill-amber-400" />
        <path d="m24 3 5 3 6 1 2 6 4 5-2 6-1 6-6 2-5 4-6-2-6-1-2-6-4-5 2-6 1-6 6-2Z" className="fill-brand-100 stroke-brand-500" strokeWidth="2.5" />
      </>}
      {kind === "flag" && <>
        <path d="m8 8 19 45" className="stroke-amber-400" strokeWidth="3" />
        <path d="M9 10c14-9 23-4 34-1l-9 5 3 11c-11-5-16-7-23-3Z" className="fill-brand-500" />
        <circle cx="7" cy="7" r="3" className="fill-amber-400" />
      </>}
    </svg>
  );
}
