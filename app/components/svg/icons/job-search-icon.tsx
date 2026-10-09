const paths = {
  leaf: "M20 3C9 2 3 7 5 14c3 8 15 5 15-11Z M3 21 16 8 M8 16v-5 M12 12h5",
  snowflake: "M12 2v20 M3.34 7l17.32 10 M3.34 17 20.66 7 M9 4l3 3 3-3 M9 20l3-3 3 3 M3.6 10.6l4.1-1.1-1.1-4.1 M17.4 18.6l-1.1-4.1 4.1-1.1 M3.6 13.4l4.1 1.1-1.1 4.1 M17.4 5.4l-1.1 4.1 4.1 1.1",
  flower: "M12 9c-6-8 6-8 0 0 M15 10c3-9 9 1 0 0 M15 14c9-1 3 9 0 0 M12 15c6 8-6 8 0 0 M9 14c-3 9-9-1 0 0 M9 10c-9 1-3-9 0 0 M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  sun: "M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z M12 2v2 M12 20v2 M2 12h2 M20 12h2 M5 5l1.5 1.5 M17.5 17.5 19 19 M5 19l1.5-1.5 M17.5 6.5 19 5",
  monitor: "M3 4h18v13H3z M8 21h8 M12 17v4 M9 8l-3 3 3 3 M15 8l3 3-3 3",
  globe: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z M3 12h18 M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z",
  people: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z M17 4a4 4 0 0 1 0 8 M22 21v-2a4 4 0 0 0-3-3.87",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  calendar: "M5 5h14v16H5z M8 3v4 M16 3v4 M5 10h14 M9 14h1 M14 14h1 M9 17h1",
  book: "M12 5C9 3 5 3 2 4v15c3-1 7-1 10 1 3-2 7-2 10-1V4c-3-1-7-1-10 1Z M12 5v15 M6 8h2 M16 8h2",
  document: "M6 3h9l4 4v14H6z M14 3v5h5 M9 12h7 M9 16h7",
  search: "M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z M15 15l6 6",
  send: "m22 2-7 20-4-9-9-4 20-7Z M22 2 11 13",
  check: "m5 12 4 4L19 6",
} as const;

export type GuideIconName = keyof typeof paths;

export function JobSearchIcon({ name, className = "size-7" }: { name: GuideIconName; className?: string; }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d={paths[name]} /></svg>;
}
