import { useEffect } from "react";

export default function useScrollReveal() {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!("IntersectionObserver" in window)) return;

    const animations = new Set<Animation>();
    let observer: IntersectionObserver | undefined;

    function start() {
      observer?.disconnect();
      animations.forEach((animation) => animation.cancel());
      animations.clear();
      if (preference.matches) return;

      observer = new IntersectionObserver((entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        visible.forEach((entry, index) => {
          const element = entry.target as HTMLElement;
          observer?.unobserve(element);
          if (element.dataset.revealed) return;
          element.dataset.revealed = "true";
          // Keep focused controls and anchor destinations immediately readable.
          if (element.contains(document.activeElement)) return;
          const isBadge = element.dataset.reveal === "badge";
          const badgeIndex = Array.from(element.parentElement?.children ?? []).indexOf(element);
          const animation = element.animate(
            isBadge ? [
              { opacity: 0, transform: "translateX(40px) scale(0.94)" },
              { opacity: 1, transform: "translateX(0) scale(1)" },
            ] : [
              { opacity: 0, translate: "0 48px" },
              { opacity: 1, translate: "0 0" },
            ],
            {
              duration: isBadge ? 1000 : 900,
              delay: isBadge ? 180 + badgeIndex * 180 : Math.min(index, 3) * 120,
              easing: "cubic-bezier(0.22, 1, 0.36, 1)",
              fill: "backwards",
            },
          );
          animations.add(animation);
          animation.onfinish = () => animations.delete(animation);
        });
      }, { threshold: 0.08 });

      document.querySelectorAll("[data-reveal]").forEach((element) => observer?.observe(element));
    }

    function revealFocusedContent(event: FocusEvent) {
      const target = event.target as HTMLElement;
      target.closest("[data-reveal]")?.getAnimations().forEach((animation) => animation.finish());
    }

    start();
    preference.addEventListener("change", start);
    document.addEventListener("focusin", revealFocusedContent);
    return () => {
      observer?.disconnect();
      animations.forEach((animation) => animation.cancel());
      preference.removeEventListener("change", start);
      document.removeEventListener("focusin", revealFocusedContent);
    };
  }, []);
}
