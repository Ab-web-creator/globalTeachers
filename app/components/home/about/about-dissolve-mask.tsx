import type { CSSProperties } from "react";
import styles from "./about-carousel.module.css";

function scatter(index: number, salt: number) {
  const value = Math.sin((index + 1) * 127.1 + salt * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

export default function AboutDissolveMask({ id, seed }: { id: string; seed: number }) {
  const spots = Array.from({ length: 600 }, (_, index) => ({
    x: scatter(index, 1 + seed * 5),
    y: scatter(index, 2 + seed * 5),
    radius: 0.025 + scatter(index, 3 + seed * 5) * 0.025,
    delay: Math.round(scatter(index, 4 + seed * 5) * 780),
  }));
  return (
    <svg aria-hidden="true" className="pointer-events-none absolute size-0">
      <defs>
        <mask id={id} maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox" x="0" y="0" width="1" height="1" style={{ maskType: "luminance" }}>
          <rect width="1" height="1" fill="white" />
          {spots.map((spot, index) => (
            <g key={index} transform={`translate(${spot.x} ${spot.y})`}>
              <rect x={-spot.radius} y={-spot.radius} width={spot.radius * 2} height={spot.radius * 2} fill="black" className={styles.spot} style={{ "--delay": `${spot.delay}ms` } as CSSProperties} />
            </g>
          ))}
        </mask>
      </defs>
    </svg>
  );
}
