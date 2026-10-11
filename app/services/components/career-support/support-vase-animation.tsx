"use client";

import { SupportVaseOverlay } from "@/app/components/svg";
import { useEffect, useState } from "react";

export default function SupportVaseAnimation() {
  const [turn, setTurn] = useState({ selected: [0], count: 0 });
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      const first = Math.floor(Math.random() * 4);
      const second = (first + 1 + Math.floor(Math.random() * 3)) % 4;
      const selected = Math.random() < 0.5 ? [first] : [first, second];
      setTurn(previous => ({ selected, count: previous.count + 1 }));
    }, 4000);
    return () => clearInterval(timer);
  }, []);
  return <SupportVaseOverlay turn={turn} />;
}
