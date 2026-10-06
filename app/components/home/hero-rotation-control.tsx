export default function HeroRotationControl({ paused, onToggle }: { paused: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={paused ? "Продолжить смену изображений" : "Приостановить смену изображений"}
      aria-pressed={paused}
      className="absolute right-6 bottom-6 z-20 flex size-10 items-center justify-center rounded-full border border-white/40 bg-brand-950/40 text-white backdrop-blur-sm transition-colors hover:bg-brand-950/70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:hidden"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="currentColor">
        {paused ? <path d="m8 5 11 7-11 7Z" /> : <path d="M7 5h4v14H7zM14 5h4v14h-4z" />}
      </svg>
    </button>
  );
}
