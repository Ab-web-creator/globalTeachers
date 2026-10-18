"use client";

import { useTranslations } from "@/lib/i18n/use-translations";
import { programIconPaths, StrokeIcon, type ProgramIconName } from "@/app/components/svg";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "../components/animated-check-list.module.css";
import { iconTones } from "../components/icon-tones";

const icons: ProgramIconName[] = ["globe", "school", "target", "calendar", "document", "profile"];

export default function AnimatedStrategyList({ items }: { items: readonly string[] }) {
  const t = useTranslations();
  const container = useRef<HTMLUListElement>(null);
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState({ item: 0, letter: 0 });
  const labels = useMemo(() => items.map(text => {
    const label = t.content(text).replace(/[;.]$/, "");
    return label.charAt(0).toUpperCase() + label.slice(1);
  }), [items, t]);

  useEffect(() => {
    if (!container.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setStarted(true);
      observer.disconnect();
    }, { threshold: 0.15 });
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started || !labels.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let item = 0;
    let letter = 0;
    let timer: ReturnType<typeof setTimeout>;
    function advance() {
      letter += 1;
      setProgress({ item, letter });
      if (letter < labels[item].length) {
        timer = setTimeout(advance, 20);
      } else if (item < labels.length - 1) {
        item += 1;
        letter = 0;
        timer = setTimeout(advance, 600);
      }
    }
    timer = setTimeout(advance, 20);
    return () => clearTimeout(timer);
  }, [started, labels]);

  return (
    <ul ref={container} className="mt-10 grid gap-x-12 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
      {labels.map((label, itemIndex) => {
        let offset = 0;
        return (
          <li key={label} className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm sm:p-5">
            <span aria-hidden="true" className={`flex size-9 shrink-0 items-center justify-center rounded-full sm:size-11 ${iconTones[itemIndex]}`}>
              <StrokeIcon path={programIconPaths[icons[itemIndex]]} className="size-4 sm:size-5" />
            </span>
            <span aria-label={t.content(label)} className="text-base leading-snug text-neutral-700 sm:text-lg">
              <span aria-hidden="true">
                {label.split(" ").map((word, wordIndex) => {
                  const start = offset;
                  offset += word.length + 1;
                  return (
                    <span key={wordIndex}>
                      {t.content(wordIndex > 0 && " ")}
                      <span className="inline-block whitespace-nowrap">
                        {Array.from(word).map((character, position) => (
                          <span key={position} className={styles.letter}>
                            <span className="invisible font-semibold">{t.content(character)}</span>
                            <span className={styles.visible} style={{ fontWeight: itemIndex < progress.item || (itemIndex === progress.item && start + position < progress.letter) ? 600 : 400 }}>{t.content(character)}</span>
                          </span>
                        ))}
                      </span>
                    </span>
                  );
                })}
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
