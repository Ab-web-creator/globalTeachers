"use client";

import { useEffect, useRef } from "react";

// Temporary font-size inspector. Remove this component from RootLayout to disable it.
export default function FontSizeInspector() {
  const tooltip = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function hide() {
      if (tooltip.current) tooltip.current.hidden = true;
    }

    function inspect(event: PointerEvent) {
      const bubble = tooltip.current;
      if (!bubble) return;
      const target = event.target;
      if (event.pointerType !== "mouse" || !(target instanceof HTMLElement)) {
        hide();
        return;
      }

      const hasDirectText = Array.from(target.childNodes).some(node => node.nodeType === Node.TEXT_NODE && node.textContent?.trim());
      const element = hasDirectText ? target : target.closest("h1, h2, h3, h4, h5, h6, p, span, a, button, li, label, input, textarea, select, td, th, strong, em, small, summary, blockquote");
      if (!(element instanceof HTMLElement) || !element.textContent?.trim() && !element.matches("input, textarea, select")) {
        hide();
        return;
      }

      bubble.textContent = `Font size: ${window.getComputedStyle(element).fontSize}`;
      bubble.hidden = false;
      bubble.style.left = `${Math.max(8, Math.min(event.clientX + 12, window.innerWidth - bubble.offsetWidth - 8))}px`;
      bubble.style.top = `${Math.max(8, Math.min(event.clientY + 16, window.innerHeight - bubble.offsetHeight - 8))}px`;
    }

    document.addEventListener("pointermove", inspect);
    document.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);
    window.addEventListener("scroll", hide, true);
    return () => {
      document.removeEventListener("pointermove", inspect);
      document.removeEventListener("pointerleave", hide);
      window.removeEventListener("blur", hide);
      window.removeEventListener("scroll", hide, true);
    };
  }, []);

  return <div ref={tooltip} hidden aria-hidden="true" className="pointer-events-none fixed z-[9999] rounded-md bg-neutral-900 px-2 py-1 text-xs leading-normal text-white shadow-md" />;
}
