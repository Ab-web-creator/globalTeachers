export default function PreparationNote() {
  return (
    <div aria-hidden="true" className="w-64">
      <svg viewBox="0 0 260 120" fill="none" className="h-auto w-full">
        <rect x="36" y="20" width="84" height="92" rx="12" fill="white" transform="rotate(-9 36 20)" />
        <path d="M55 43h40M55 56h32M55 69h36" className="stroke-brand-300" strokeWidth="4" strokeLinecap="round" />
        <rect x="93" y="39" width="103" height="70" rx="12" fill="#e0f2fe" transform="rotate(7 93 39)" />
        <path d="m99 48 42 34 47-24" stroke="#93c5fd" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M184 16h49a12 12 0 0 1 12 12v19a12 12 0 0 1-12 12h-17l-15 12V59h-17a12 12 0 0 1-12-12V28a12 12 0 0 1 12-12Z" className="fill-brand-200" />
        <path d="m194 37 8 8 17-18" className="stroke-brand-500" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p style={{ fontFamily: '"Segoe Print", "Bradley Hand", cursive' }} className="-rotate-3 text-center text-xl italic leading-relaxed text-brand-500">
        От заявки до предложения<br />— мы рядом
      </p>
    </div>
  );
}
