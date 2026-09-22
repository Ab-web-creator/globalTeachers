export default function BookIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 44" fill="none" aria-hidden="true" className={className}>
      <path d="M23 10C17 4 10 3 5 4v31c7-1 13 1 18 5V10Zm3 0c6-6 13-7 18-6v31c-7-1-13 1-18 5V10Z" fill="currentColor" />
      <path d="M1 9v31c8-2 15-1 22 2M47 9v31c-8-2-15-1-21 2" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
