import { useEffect } from "react";

export default function useScrollReveal(selector = "[data-reveal]", desktopOnly = false) {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 1024px)");
    if (!("IntersectionObserver" in window)) return;

    const animations = new Set<Animation>();
    const pending = new Map<HTMLElement, string>();
    let observer: IntersectionObserver | undefined;

    function restore(element: HTMLElement) {
      const opacity = pending.get(element);
      if (opacity === undefined) return;
      element.style.opacity = opacity;
      pending.delete(element);
    }

    function start() {
      observer?.disconnect();
      animations.forEach((animation) => animation.finish());
      animations.clear();
      pending.forEach((_, element) => restore(element));

      const started = new WeakSet<HTMLElement>();
      observer = new IntersectionObserver((entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.08);
        visible.forEach((entry, index) => {
          const element = entry.target as HTMLElement;
          observer?.unobserve(element);
          if (element.dataset.revealed || started.has(element)) return;
          started.add(element);
          // Keep focused controls and anchor destinations immediately readable.
          if (element.contains(document.activeElement)) {
            restore(element);
            element.dataset.revealed = "true";
            return;
          }
          const isBadge = element.dataset.reveal === "badge";
          const isArrow = element.dataset.reveal === "arrow";
          const badgeIndex = Array.from(element.parentElement?.children ?? []).indexOf(element);
          const animation = element.animate(
            isBadge ? [
              { opacity: 0, transform: "translateX(40px) scale(0.94)" },
              { opacity: 1, transform: "translateX(0) scale(1)" },
            ] : [
              { opacity: 0, translate: isArrow ? "0 6px" : "0 48px" },
              { opacity: 1, translate: "0 0" },
            ],
            {
              duration: isArrow ? 250 : isBadge ? 1000 : 900,
              delay: element.dataset.revealDelay !== undefined
                ? Number(element.dataset.revealDelay)
                : isBadge ? 180 + badgeIndex * 180 : Math.min(index, 3) * 120,
              easing: "cubic-bezier(0.22, 1, 0.36, 1)",
              fill: "backwards",
            },
          );
          restore(element);
          animations.add(animation);
          animation.onfinish = () => {
            element.dataset.revealed = "true";
            animations.delete(animation);
          };
        });
      }, {
        threshold: 0.08,
        // Start reveals after content clears the bottom fifth of the screen.
        rootMargin: `0px 0px -${Math.round(window.innerHeight * 0.2)}px 0px`,
      });

      document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
        // Never fade out content the visitor can already see.
        if (desktopOnly && !desktop.matches) return;
        if (preference.matches || element.dataset.revealed || element.getBoundingClientRect().top < window.innerHeight) {
          element.dataset.revealed = "true";
          return;
        }
        pending.set(element, element.style.opacity);
        element.style.opacity = "0";
        observer?.observe(element);
      });
    }

    function revealFocusedContent(event: FocusEvent) {
      const target = event.target as HTMLElement;
      let element = target.closest<HTMLElement>("[data-reveal]");
      while (element) {
        restore(element);
        element.dataset.revealed = "true";
        observer?.unobserve(element);
        element.getAnimations().forEach((animation) => animation.finish());
        element = element.parentElement?.closest<HTMLElement>("[data-reveal]") ?? null;
      }
    }

    start();
    preference.addEventListener("change", start);
    if (desktopOnly) desktop.addEventListener("change", start);
    document.addEventListener("focusin", revealFocusedContent);
    return () => {
      observer?.disconnect();
      animations.forEach((animation) => animation.cancel());
      pending.forEach((_, element) => restore(element));
      preference.removeEventListener("change", start);
      if (desktopOnly) desktop.removeEventListener("change", start);
      document.removeEventListener("focusin", revealFocusedContent);
    };
  }, [selector, desktopOnly]);
}
