"use client";

import { useEffect, useState } from "react";

export default function useCompactHeader() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    let current = false;

    function update() {
      // Separate thresholds prevent flickering as the header changes height.
      const next = current ? window.scrollY > 16 : window.scrollY > 96;
      if (next !== current) {
        current = next;
        setCompact(next);
      }
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return compact;
}
