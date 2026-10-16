export function PersonalSeparatorIllustration({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`flex items-center text-amber-600 ${className}`}>
      <span className="size-1 shrink-0 rotate-45 bg-current" />
      <span className="h-px flex-1 bg-current opacity-40" />
      <span className="size-1 shrink-0 rotate-45 bg-current opacity-70" />
      <svg viewBox="0 0 40 32" fill="none" className="h-5 w-6 shrink-0" stroke="currentColor" strokeWidth=".9" strokeLinejoin="round">
        <path d="M20 2c-5 6-5 8 0 12 5-4 5-6 0-12ZM20 30c-5-6-5-8 0-12 5 4 5 6 0 12ZM3 16c6-5 9-5 15 0-6 5-9 5-15 0ZM37 16c-6-5-9-5-15 0 6 5 9 5 15 0Z" />
        <path d="m11 7 7 7-2-6 4 6 4-6-2 6 7-7-7 9 7 9-7-7 2 6-4-6-4 6 2-6-7 7 7-9Z" opacity=".65" />
        <path d="M20 1v30M2 16h36" opacity=".6" />
        <circle cx="20" cy="16" r="2" fill="currentColor" stroke="none" />
      </svg>
      <span className="size-1 shrink-0 rotate-45 bg-current opacity-70" />
      <span className="h-px flex-1 bg-current opacity-40" />
      <span className="size-1 shrink-0 rotate-45 bg-current" />
    </div>
  );
}
