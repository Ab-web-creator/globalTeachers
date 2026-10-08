import type { CSSProperties } from "react";
import styles from "./service-hover-art.module.css";

export default function ServiceHoverArt({ slug }: { slug: string }) {
  if (slug === "job-search") return (
    <g className={styles.checklist}>
      <circle cx="381" cy="235" r="46" fill="#fdfdfd" />
      <svg x="335" y="189" width="92" height="92" viewBox="335 189 92 92" className={styles.profile}>
        <image href="/images/course-categories-four-colors.webp" width="1254" height="1254" />
      </svg>
      {[[340, 324], [337, 386], [333, 448]].map(([x, y], index) => (
        <g key={y} transform={`rotate(3 ${x + 20} ${y + 21})`}>
          <rect x={x} y={y} width="41" height="42" rx="4" fill="#ffb5b2" />
          <path
            className={styles.check}
            style={{ animationDelay: `${250 + index * 350}ms` }}
            d={`M${x + 8} ${y + 22}l9 10 17-23`}
            fill="none" stroke="#101013" strokeWidth="5"
            strokeLinecap="round" strokeLinejoin="round" pathLength="1"
          />
        </g>
      ))}
    </g>
  );
  if (slug === "cv-portfolio") return (
    <g className={styles.chart}>
      <path d="M945 130H1162V210H1115V247H1065V278H1015V290H945Z" fill="#fdfdfd" />
      <path className={styles.arrow} d="M966 278Q1076 255 1135 171" fill="none" stroke="#8925ff" strokeWidth="9" strokeLinecap="round" pathLength="1" />
      <path className={styles.arrowHead} d="m1118 164 31-15-1 37" fill="#8925ff" />
    </g>
  );
  if (slug === "interview-preparation") return (
    <g className={styles.math}>
      {[367, 485].flatMap((x) => [900, 1017].map((y) => (
        <rect key={`${x}-${y}`} x={x - 42} y={y - 43} width="84" height="86" rx="8" fill="#dbfadd" />
      )))}
      {([ ["+", 367, 900], ["−", 485, 900], ["=", 485, 1017], ["×", 367, 1017] ] as const).map(([symbol, x, y], index, cells) => {
        const offsets = Object.fromEntries([1, 2, 3].flatMap((step) => {
          const next = cells[(index + step) % cells.length];
          return [[`--x${step}`, `${next[1] - x}px`], [`--y${step}`, `${next[2] - y}px`]];
        })) as CSSProperties;
        return (
          <g key={symbol} className={styles.symbol} style={offsets}>
            <path
              d={symbol === "+" ? `M${x - 30} ${y}h60M${x} ${y - 30}v60`
                : symbol === "−" ? `M${x - 27} ${y}h54`
                : symbol === "=" ? `M${x - 27} ${y - 13}h54M${x - 27} ${y + 13}h54`
                : `M${x - 23} ${y - 23}l46 46M${x + 23} ${y - 23}l-46 46`}
              fill="none" stroke="#101013" strokeWidth="14"
            />
          </g>
        );
      })}
    </g>
  );
  return (
    <g className={styles.globe}>
      <circle className={styles.ring} cx="1045" cy="870" r="155" fill="none" stroke="#5750cf" strokeWidth="7" />
      <path className={styles.travel} d="M937 891Q1020 740 1159 829" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeDasharray="12 14" pathLength="100" />
      <circle className={styles.destination} cx="1159" cy="829" r="13" fill="#fff" stroke="#5750cf" strokeWidth="5" />
    </g>
  );
}
