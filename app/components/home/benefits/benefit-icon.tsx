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
      {name === "insurance" && <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3Z" />}
    </svg>
  );
}
