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
    const button = element?.querySelector<HTMLElement>("[data-faq-note]");
    if (!element || !button) return;
    function measureSeparator() {
      if (!element || !button || !element.clientWidth) return;
      const lineWidth = element.clientWidth * 344 / 440;
      element.style.setProperty("--faq-separator-scale", `${button.offsetWidth / lineWidth}`);
    }
    const observer = new ResizeObserver(measureSeparator);
    observer.observe(element);
    observer.observe(button);
    measureSeparator();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!container.current) return;
    const eyebrow = container.current.querySelector<SVGTextElement>("[data-faq-eyebrow]");
    if (eyebrow) {
      const offset = 32 - 204 + eyebrow.getComputedTextLength() / 2;
      container.current.style.setProperty("--faq-eyebrow-offset", `${offset}px`);
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
    <div ref={container} data-started={started} className={`${styles.art} pointer-events-none absolute right-0 bottom-0 hidden w-1/3 max-w-md overflow-hidden xl:right-4 ${hidden ? "" : "lg:block"}`}>
      <FaqClarityIllustration ornament={ornament} className="h-auto w-full" />
      <Link href="/consultation" data-faq-note className="action-gradient pointer-events-auto absolute bottom-[6.67%] left-[7.27%] inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-full px-6 py-3 text-base font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500">
        Получить консультацию
      </Link>
    </div>
  );
}
