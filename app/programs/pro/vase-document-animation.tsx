"use client";

import { VaseDocumentOverlay, vaseDocumentClipPaths } from "@/app/components/svg";
import { useEffect, useState } from "react";

export default function VaseDocumentAnimation() {
  const [turn, setTurn] = useState({ selected: [0], count: 0 });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      const first = Math.floor(Math.random() * vaseDocumentClipPaths.length);
      const second = (first + 1 + Math.floor(Math.random() * (vaseDocumentClipPaths.length - 1))) % vaseDocumentClipPaths.length;
      const selected = Math.random() < 0.5 ? [first] : [first, second];
      setTurn((previous) => ({ selected, count: previous.count + 1 }));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <VaseDocumentOverlay turn={turn} />
  );
}
