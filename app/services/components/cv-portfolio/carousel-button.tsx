export default function CarouselButton({ direction, onClick }: { direction: "prev" | "next"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "prev" ? "Предыдущий пример" : "Следующий пример"}
      className="flex size-11 items-center justify-center rounded-full border border-brand-300 bg-white text-brand-500 shadow-sm transition-colors duration-200 hover:bg-brand-100 motion-reduce:transition-none"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`size-5 ${direction === "prev" ? "rotate-180" : ""}`} aria-hidden="true">
        <path d="M5 12h14m-6-6 6 6-6 6" />
      </svg>
    </button>
  );
}
