"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./count-up.module.css";

export default function CountUp({ value }: { value: number }) {
  const container = useRef<HTMLSpanElement>(null);
  const [rolling, setRolling] = useState(false);
  const formatted = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  useEffect(() => {
    const element = container.current;
    if (!element || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) setRolling(true);
    }, { threshold: 0.5 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={container} className="inline-flex tabular-nums">
      <span className="sr-only">{formatted}+</span>
      <span aria-hidden="true" className="inline-flex">
        {formatted.split("").map((character, index) => {
          if (character === " ") return <span key={index} className="whitespace-pre"> </span>;
          const steps = 20 + Number(character);
          const initial = index === formatted.length - 1 ? 1 : 0;
          const style = {
            "--roll-start": `${-initial / (steps + 1) * 100}%`,
            "--roll-end": `${-steps / (steps + 1) * 100}%`,
            "--roll-duration": `${1.6 + index * 0.12}s`,
          } as CSSProperties;

          return (
            <span key={index} className={styles.digit} style={style}>
              <span className={rolling ? styles.fallback : undefined}>{character}</span>
              {rolling && <span className={styles.reel}>
                {Array.from({ length: steps + 1 }, (_, step) => <span key={step} className={styles.cell}>{step % 10}</span>)}
              </span>}
            </span>
          );
        })}
        <span>+</span>
      </span>
    </span>
  );
}
