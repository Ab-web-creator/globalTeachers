"use client";

import { useEffect, useState, type RefObject } from "react";

export default function useCompactHeader(headerRef: RefObject<HTMLElement | null>) {
  const [compact, setCompact] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
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
  }, [headerRef]);

  return { compact, hidden };
}
