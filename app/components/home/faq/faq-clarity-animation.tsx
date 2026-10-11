"use client";

import { FaqClarityIllustration } from "@/app/components/svg";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./faq-clarity-animation.module.css";

export default function FaqClarityAnimation({ hidden }: { hidden: boolean }) {
  const container = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!container.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || entry.intersectionRatio < 0.5) return;
      setStarted(true);
      observer.disconnect();
    }, { threshold: 0.5 });
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={container} data-started={started} className={`${styles.art} pointer-events-none absolute top-40 right-0 hidden w-1/3 max-w-md overflow-hidden xl:right-4 ${hidden ? "" : "lg:block"}`}>
      <FaqClarityIllustration className="h-auto w-full" />
      <Link href="/consultation" data-faq-note className="action-gradient pointer-events-auto absolute bottom-[6.67%] left-[7.27%] inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-full px-6 py-3 text-base font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500">
        Получить консультацию
      </Link>
    </div>
  );
}
