"use client";

import { useEffect, useRef, useState } from "react";

export default function useStagePreview(enabled: boolean, count: number) {
  const container = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [exiting, setExiting] = useState(false);
  const stopped = useRef(false);

  useEffect(() => {
    if (!enabled || !container.current) return;

    const desktop = window.matchMedia("(min-width: 1024px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setTimeout> | undefined;
    let transitionTimer: ReturnType<typeof setTimeout> | undefined;
    let visible = false;
    let current = 0;

    function schedule() {
      clearTimeout(timer);
      if (!visible || !desktop.matches || reducedMotion.matches || stopped.current || current >= count - 1) return;
      timer = setTimeout(() => {
        if (stopped.current || !visible || !desktop.matches || reducedMotion.matches) return;
        setExiting(true);
        transitionTimer = setTimeout(() => {
          setExiting(false);
          if (stopped.current || !visible || !desktop.matches || reducedMotion.matches) return;
          current += 1;
          setActive(current);
          schedule();
        }, 300);
      }, 4000);
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.35;
      schedule();
    }, { threshold: 0.35 });
    observer.observe(container.current.querySelector('[role="tablist"]') ?? container.current);
    desktop.addEventListener("change", schedule);
    reducedMotion.addEventListener("change", schedule);

    return () => {
      clearTimeout(timer);
      clearTimeout(transitionTimer);
      observer.disconnect();
      desktop.removeEventListener("change", schedule);
      reducedMotion.removeEventListener("change", schedule);
    };
  }, [enabled, count]);

  function stopPreview() {
    stopped.current = true;
    setExiting(false);
  }

  function select(index: number) {
    stopPreview();
    setActive(index);
  }

  return { container, active, exiting, select, stopPreview };
}
