"use client";

import { useEffect, useState, type RefObject } from "react";

export default function useCompactHeader(headerRef: RefObject<HTMLElement | null>, homepage: boolean) {
  const [compact, setCompact] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!homepage) {
      // Hide while scrolling down past the threshold; reveal as soon as the user scrolls back up.
      let lastY = window.scrollY;
      const update = () => {
        const y = Math.max(window.scrollY, 0);
        const delta = y - lastY;
        // Ignore tiny movements (momentum, iOS bounce) so the header does not flicker.
        if (Math.abs(delta) < 8) return;
        setHidden(delta > 0 && y > 200);
        lastY = y;
      };
      window.addEventListener("scroll", update, { passive: true });
      return () => window.removeEventListener("scroll", update);
    }

    let current = false;
    let hero: HTMLElement | null = null;
    let expandedHeight = headerRef.current?.getBoundingClientRect().height ?? 0;
    const observer = new ResizeObserver(update);

    function update() {
      if (!hero) {
        hero = document.querySelector<HTMLElement>('section[aria-labelledby="hero-title"]');
        if (hero) observer.observe(hero);
      }
      // Retain the expanded height so shrinking the navbar cannot flip it back.
      if (!current) expandedHeight = headerRef.current?.getBoundingClientRect().height ?? expandedHeight;
      // The hero can mount after the header during client navigation.
      const next = hero ? hero.getBoundingClientRect().bottom <= expandedHeight : false;
      setHidden(!next && window.scrollY > 0);
      if (next !== current) {
        current = next;
        setCompact(next);
      }
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const mountObserver = new MutationObserver(() => {
      update();
      if (hero) mountObserver.disconnect();
    });
    if (!hero) mountObserver.observe(document.body, { childList: true, subtree: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      observer.disconnect();
      mountObserver.disconnect();
    };
  }, [headerRef, homepage]);

  return { compact, hidden };
}
