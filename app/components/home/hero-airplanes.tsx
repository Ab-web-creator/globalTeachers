import styles from "./hero-airplanes.module.css";

export default function HeroAirplanes() {
  return (
    <div aria-hidden="true" className={`${styles.windows} pointer-events-none absolute inset-0 -z-20 overflow-hidden`}>
      {[styles.departing, styles.arriving, styles.distant].map((flight) => (
        <div key={flight} className={`${styles.flight} ${flight}`}>
          <svg viewBox="0 0 120 40" className={styles.plane} fill="currentColor">
            <path d="M5 25 2 10h7l13 14 30-1L39 4h9l27 18 25-1c8 0 16 4 18 7-3 3-9 4-17 4H74L49 39h-9l15-8-32-1-12 3H5l5-5Z" />
          </svg>
        </div>
      ))}
    </div>
  );
}
