"use client";

import { useEffect, useState, type ReactNode } from "react";

// Slides the admin navbar away while scrolling down and brings it back on any scroll up.
export default function AdminHeader({ children }: { children: ReactNode }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const update = () => {
      const y = Math.max(window.scrollY, 0);
      const delta = y - lastY;
      // Ignore tiny movements (momentum, iOS bounce) so the navbar does not flicker.
      if (Math.abs(delta) < 8) return;
      setHidden(delta > 0 && y > 80);
      lastY = y;
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header className={`sticky top-0 z-30 shrink-0 border-b border-brand-100 bg-white/95 backdrop-blur-lg transition-transform duration-200 has-focus-visible:translate-y-0 motion-reduce:transition-none ${hidden ? "-translate-y-full" : "translate-y-0"}`}>
      {children}
    </header>
  );
}
