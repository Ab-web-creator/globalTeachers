import type { BenefitIconName } from "../../home/benefits/benefits-content";

export function CareerBenefitIcon({ name }: {
  name: BenefitIconName;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-10" aria-hidden="true">
      {name === "salary" && (<>
        <ellipse cx="12" cy="5" rx="7" ry="3" />
        <path d="M5 5v5c0 4 14 4 14 0V5M5 10v5c0 4 14 4 14 0v-5M5 15v4c0 4 14 4 14 0v-4" />
      </>)}
      {name === "housing" && <path d="m3 11 9-8 9 8M5 10v11h5v-7h4v7h5V10M16 4h3v4" />}
      {name === "flights" && (<path d="M12 2c-.8 0-1.5.9-1.5 2v4L3 12v2.5l7.5-2V18l-3 2v2l4.5-1.5 4.5 1.5v-2l-3-2v-5.5l7.5 2V12l-7.5-4V4c0-1.1-.7-2-1.5-2Z" />)}
      {name === "education" && (<>
        <path d="m2 9 10-5 10 5-10 5L2 9ZM6 11v7l6 3 6-3v-7M22 9v7" />
      </>)}
      {name === "insurance" && (<>
        <path d="M4 9h16a8 6 0 0 1-16 0ZM12 15v7M8 22h8" />
        <path d="M12 4c0-3 7-3 7 1 0 4-6 5-6 8 0 3 4 3 3 5s-6 0-6 3" />
        <ellipse cx="11" cy="4" rx="1.5" ry="1" fill="currentColor" stroke="none" />
      </>)}
      {name === "relocation" && (<>
        <rect x="3" y="7" width="18" height="14" rx="2" />
        <path d="M8 7V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v3M8 7v14M16 7v14" />
      </>)}
      {name === "development" && (<>
        <path d="M3 3v16a2 2 0 0 0 2 2h16" />
        <path d="m7 14 4-4 4 3 6-8M15 5h6v6" />
      </>)}
      {name === "visa" && (<>
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <circle cx="12" cy="10" r="4" />
        <path d="M8 10h8M12 6c-2 2-2 6 0 8 2-2 2-6 0-8ZM9 18h6" />
      </>)}
    </svg>
  );
}
