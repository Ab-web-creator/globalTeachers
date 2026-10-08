"use client";

import { useEffect, useState } from "react";
import styles from "./vase-document-animation.module.css";

const panels = [
  "M443 960Q407 958 402 994L402 1198Q405 1238 439 1240H577L610 1180L644 1133L644 1000Q640 972 607 967Z",
  "M656 1159L739 1146L725 1346L640 1370L609 1310Z",
  "M480 1234H578L586 1319L535 1355L474 1317Z",
  "M278 1121L364 1132L390 1327L361 1354L290 1328Z",
];

export default function VaseDocumentAnimation() {
  const [turn, setTurn] = useState({ selected: [0], count: 0 });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      const first = Math.floor(Math.random() * panels.length);
      const second = (first + 1 + Math.floor(Math.random() * (panels.length - 1))) % panels.length;
      const selected = Math.random() < 0.5 ? [first] : [first, second];
      setTurn((previous) => ({ selected, count: previous.count + 1 }));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <svg aria-hidden="true" viewBox="0 0 1024 1536" className="pointer-events-none absolute inset-0 size-full motion-reduce:hidden">
      <defs>
        {panels.map((path, index) => (
          <clipPath key={path} id={`vase-document-${index}`}>
            <path d={path} />
          </clipPath>
        ))}
      </defs>
      {panels.map((path, index) => (
        <g key={path} clipPath={`url(#vase-document-${index})`}>
          <image href="/images/pro-document-vase-bouquet-v2.png" width="1024" height="1536" key={turn.count} className={turn.selected.includes(index) ? styles.artwork : undefined} />
        </g>
      ))}
    </svg>
  );
}
