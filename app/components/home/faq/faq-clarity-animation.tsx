"use client";

import { whenHeroSlidesReady } from "@/app/components/image-schedule";
import { FaqClarityIllustration } from "@/app/components/svg";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./faq-clarity-animation.module.css";

export default function FaqClarityAnimation({ hidden }: { hidden: boolean }) {
  const container = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [ornament, setOrnament] = useState("");
  useLayoutEffect(() => whenHeroSlidesReady(() => setOrnament("/images/footer-reference-pattern.webp")), []);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    function measureTextBlocks() {
      if (!element || !element.clientWidth) return;
      const eyebrow = element.querySelector<SVGTextElement>("[data-faq-eyebrow]");
      if (eyebrow) {
        const offset = 20 - eyebrow.getBBox().x;
        element.style.setProperty("--faq-eyebrow-offset", `${offset}px`);
      }
      const summaryText = element.querySelector<SVGTextElement>("[data-faq-summary-text]");
      const summaryBackground = element.querySelector<SVGRectElement>("[data-faq-summary-background]");
      if (summaryText && summaryBackground) {
        summaryBackground.setAttribute("width", `${summaryText.getComputedTextLength() + 24}`);
      }
      const introBackground = element.querySelector<SVGRectElement>("[data-faq-intro-background]");
      const introLines = element.querySelectorAll<SVGTextElement>("[data-faq-intro-text]");
      if (introBackground && introLines.length) {
        const textRight = Math.max(...Array.from(introLines, line => {
          const bounds = line.getBBox();
          return bounds.x + bounds.width;
        }));
        const rightPadding = 24;
        introBackground.setAttribute("width", `${textRight - introBackground.x.baseVal.value + rightPadding}`);
      }
    }
    const observer = new ResizeObserver(measureTextBlocks);
    observer.observe(element);
    element.querySelectorAll<SVGTextElement>("[data-faq-eyebrow], [data-faq-intro-text], [data-faq-summary-text]").forEach(text => observer.observe(text));
    measureTextBlocks();
    void document.fonts.ready.then(measureTextBlocks);
    document.fonts.addEventListener("loadingdone", measureTextBlocks);
    return () => {
      observer.disconnect();
      document.fonts.removeEventListener("loadingdone", measureTextBlocks);
    };
  }, []);

  useEffect(() => {
    if (!container.current) return;
    const section = container.current.closest("section");
    if (!section) return;
    let fontsReady = false;
    let disposed = false;
    function checkVisibility() {
      if (disposed || !fontsReady || !section || !container.current || container.current.getClientRects().length === 0) return;
      const { top, height } = section.getBoundingClientRect();
      const lastQuarterStart = top + height * 0.75;
      if (lastQuarterStart <= 0 || lastQuarterStart > window.innerHeight) return;
      const eyebrow = container.current.querySelector<SVGTextElement>("[data-faq-eyebrow]");
      if (eyebrow) {
        container.current.style.setProperty("--faq-eyebrow-offset", `${20 - eyebrow.getBBox().x}px`);
      }
      setStarted(true);
      window.removeEventListener("scroll", checkVisibility);
      window.removeEventListener("resize", checkVisibility);
    }
    window.addEventListener("scroll", checkVisibility, { passive: true });
    window.addEventListener("resize", checkVisibility);
    void document.fonts.ready.then(() => {
      fontsReady = true;
      checkVisibility();
    });
    return () => {
      disposed = true;
      window.removeEventListener("scroll", checkVisibility);
      window.removeEventListener("resize", checkVisibility);
    };
  }, []);

  return (
    <div ref={container} data-started={started} className={`${styles.art} pointer-events-none absolute right-0 bottom-0 hidden w-5/12 max-w-lg overflow-hidden xl:right-4 ${hidden ? "" : "lg:block"}`}>
      <FaqClarityIllustration ornament={ornament} className="h-auto w-full" />
      <Link href="/consultation" data-faq-note className="action-gradient pointer-events-auto absolute top-[85.49%] left-[4.55%] mt-3 inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-full px-6 py-3 text-base font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500">
        Начать с консультации
      </Link>
    </div>
  );
}
