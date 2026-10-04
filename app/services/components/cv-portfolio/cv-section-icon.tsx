const paths = {
  idCard: "M3 5h18v14H3z M10 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z M5 16c.5-1.5 1.7-2.5 3-2.5s2.5 1 3 2.5 M14 9h4 M14 13h4",
  graduation: "M2 9l10-5 10 5-10 5-10-5Z M6 11v5c3 2.5 9 2.5 12 0v-5 M22 9v6",
  briefcase: "M3 7h18v13H3z M8 7V4h8v3 M3 13h18 M11 13v2h2v-2",
  trophy: "M7 4h10v5a5 5 0 0 1-10 0V4Z M7 6H4v2a3 3 0 0 0 3 3 M17 6h3v2a3 3 0 0 1-3 3 M12 14v4 M8 21h8 M9 18h6",
  languages: "M4 5h8 M8 3v2 M10 5c-1 4-3 7-6 9 M6 9c1 2 3 4 5 5 M13 21l4-10 4 10 M14.5 17.5h5",
} as const;

export type CvSectionIconName = keyof typeof paths;

export default function CvSectionIcon({ name }: { name: CvSectionIconName }) {
  return (
    <span aria-hidden="true" className="flex size-14 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="size-7">
        <path d={paths[name]} />
      </svg>
    </span>
  );
}
