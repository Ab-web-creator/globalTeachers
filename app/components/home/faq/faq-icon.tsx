const paths = {
  experience: "M8 7V4h8v3M3 7h18v14H3V7ZM3 12l9 3 9-3M10 12h4v4h-4z",
  education: "m2 9 10-5 10 5-10 5L2 9ZM6 11v7l6 3 6-3v-7M22 9v7",
  language: "M7 4h10a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4h-5l-5 3v-3a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4ZM7 9h10M7 13h6",
  countries: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM3 12h18M12 3c-5 5-5 13 0 18 5-5 5-13 0-18Z",
  salary: "M3 5h18v14H3V5ZM14.5 12a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM3 9a4 4 0 0 0 4-4M17 5a4 4 0 0 0 4 4M3 15a4 4 0 0 1 4 4M17 19a4 4 0 0 1 4-4",
  visa: "M5 2h14v20H5V2ZM16 9a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM8 9h8M12 5v8M9 18h6",
  family: "M9 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM21 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM2 20v-6a4 4 0 0 1 6-3M22 20v-6a4 4 0 0 0-6-3M14 13a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM8 22v-2a4 4 0 0 1 8 0v2",
  timing: "M4 5h16v16H4V5ZM8 2v6M16 2v6M4 10h16M8 14h2M14 14h2M8 18h2",
  hiring: "m12 2-9 4v6c0 5 9 10 9 10s9-5 9-10V6l-9-4ZM8 12l3 3 5-6",
  start: "M5 21V3M5 4c5-4 9 4 15 0v10c-6 4-10-4-15 0",
};

export type FaqIconName = keyof typeof paths;

export default function FaqIcon({ name }: { name: FaqIconName }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}
