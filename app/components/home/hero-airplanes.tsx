import { HeroAirplaneIllustration } from "@/app/components/svg";
import styles from "./hero-airplanes.module.css";

export default function HeroAirplanes() {
  return (
    <div aria-hidden="true" className={`${styles.windows} pointer-events-none absolute inset-0 z-0 -scale-x-100 overflow-hidden sm:scale-x-100`}>
      {[styles.departing, styles.arriving, styles.distant].map((flight) => (
        <div key={flight} className={`${styles.flight} ${flight}`}>
          <HeroAirplaneIllustration className={styles.plane} />
        </div>
      ))}
    </div>
  );
}
