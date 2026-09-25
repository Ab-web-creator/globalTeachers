import type { BenefitIconName } from "./benefits-content";

export default function BenefitIcon({ name }: { name: BenefitIconName }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-10" aria-hidden="true">
      {name === "salary" && (
        <>
          <ellipse cx="12" cy="5" rx="7" ry="3" />
          <path d="M5 5v5c0 4 14 4 14 0V5M5 10v5c0 4 14 4 14 0v-5M5 15v4c0 4 14 4 14 0v-4" />
        </>
      )}
      {name === "housing" && <path d="m3 11 9-8 9 8M5 10v11h5v-7h4v7h5V10M16 4h3v4" />}
      {name === "flights" && <path d="m22 2-7 2-4 6-7-1-2 2 7 4-3 5 2 2 5-5 4 5 2-2-1-8 4-7Z" />}
      {name === "education" && (
        <>
          <path d="m2 9 10-5 10 5-10 5L2 9ZM6 11v7l6 3 6-3v-7M22 9v7" />
        </>
      )}
      {name === "insurance" && <path d="M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6l-9-4ZM12 8v8M8 12h8" />}
      {name === "relocation" && (
        <>
          <rect x="3" y="7" width="18" height="14" rx="2" />
          <path d="M8 7V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v3M8 7v14M16 7v14" />
        </>
      )}
      {name === "development" && (
        <>
          <path d="M4 21v-4M9 21v-7M14 21V10M19 21V5M3 11c7 0 12-4 17-9M13 2h7v7" />
        </>
      )}
      {name === "visa" && (
        <>
          <rect x="5" y="2" width="14" height="20" rx="2" />
          <circle cx="12" cy="10" r="4" />
          <path d="M8 10h8M12 6c-2 2-2 6 0 8 2-2 2-6 0-8ZM9 18h6" />
        </>
      )}
    </svg>
  );
}
