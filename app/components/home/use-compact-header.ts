"use client";

import { useEffect, useState, type RefObject } from "react";

export default function useCompactHeader(headerRef: RefObject<HTMLElement | null>) {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    let current = false;
    const hero = document.querySelector<HTMLElement>('section[aria-labelledby="hero-title"]');
    let expandedHeight = headerRef.current?.getBoundingClientRect().height ?? 0;

    function update() {
      // Retain the expanded height so shrinking the navbar cannot flip it back.
      if (!current) expandedHeight = headerRef.current?.getBoundingClientRect().height ?? expandedHeight;
      const next = !hero || hero.getBoundingClientRect().bottom <= expandedHeight;
      if (next !== current) {
        current = next;
        setCompact(next);
      }
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const observer = new ResizeObserver(update);
    if (hero) observer.observe(hero);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      observer.disconnect();
    };
  }, [headerRef]);

  return compact;
}
