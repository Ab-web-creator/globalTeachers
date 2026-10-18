"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import { VipSupportJourneyIllustration } from "@/app/components/svg";
import { useEffect, useRef, useState } from "react";
import styles from "./support-journey-animation.module.css";

export default function SupportJourneyAnimation() {
  const t = useTranslations();
  const container = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!container.current) return;
    const title = container.current.querySelector<SVGTextElement>("[data-journey-title]");
    if (title) {
      const offset = 32 - 220 + title.getComputedTextLength() / 2;
      container.current.style.setProperty("--journey-title-offset", `${offset}px`);
    }
    const closing = container.current.querySelector<SVGTextElement>("[data-journey-closing]");
    if (closing) {
      container.current.style.setProperty("--journey-divider-scale", `${closing.getComputedTextLength() / 376}`);
    }
    const section = container.current.closest("section");
    if (!section) return;

    function checkVisibility() {
      if (!section || !container.current || container.current.getClientRects().length === 0) return;
      const { top, height } = section.getBoundingClientRect();
      const lastQuarterStart = top + height * 0.75;
      if (lastQuarterStart <= 0 || lastQuarterStart > window.innerHeight) return;
      setStarted(true);
      window.removeEventListener("scroll", checkVisibility);
      window.removeEventListener("resize", checkVisibility);
    }

    window.addEventListener("scroll", checkVisibility, { passive: true });
    window.addEventListener("resize", checkVisibility);
    checkVisibility();
    return () => {
      window.removeEventListener("scroll", checkVisibility);
      window.removeEventListener("resize", checkVisibility);
    };
  }, []);

  return (
    <div ref={container} data-started={started} className={`${styles.journey} ml-auto hidden w-full max-w-md lg:block`}>
      <VipSupportJourneyIllustration translate={t.content} className="h-auto w-full" />
    </div>
  );
}
