"use client";

import { programIconPaths, StrokeIcon, type ProgramIconName } from "@/app/components/svg";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./animated-check-list.module.css";

export default function AnimatedCheckList({ items, icon = "question", columns = false }: {
  items: readonly string[]; icon?: ProgramIconName; columns?: boolean;
}) {
  const questions = useMemo(() => items.map((text) => text.replace(/[;.]$/, "")), [items]);
  const container = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState({ question: 0, letter: 0 });

  useEffect(() => {
    if (!container.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || entry.intersectionRatio < 0.75) return;
      setStarted(true);
      observer.disconnect();
    }, { threshold: 0.75 });
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started || questions.length === 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let question = 0;
    let letter = 0;
    let timer: ReturnType<typeof setTimeout>;

    function advance() {
      letter += 1;
      setProgress({ question, letter });
      if (letter < questions[question].length) {
        timer = setTimeout(advance, 20);
      } else if (question < questions.length - 1) {
        question += 1;
        letter = 0;
        timer = setTimeout(advance, 600);
      }
    }

    timer = setTimeout(advance, 20);
    return () => clearTimeout(timer);
  }, [started, questions]);

  return (
    <div ref={container} className="rounded-3xl border border-brand-100 bg-white/80 p-6 sm:p-8">
      <ul className={`grid gap-3 ${columns ? "sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-3 sm:gap-x-8" : ""}`}>
        {questions.map((question, questionIndex) => {
          return (
            <li key={question} className="flex items-start gap-4">
              <span aria-hidden="true" className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-500">
                <StrokeIcon path={programIconPaths[icon]} className="size-4" />
              </span>
              <span aria-label={question} className="leading-relaxed text-neutral-700">
                <span aria-hidden="true">
                  {question.split(" ").map((word, index) => (
                    <span key={index}>
                      {index > 0 && " "}
                      <span className="inline-block whitespace-nowrap">
                        {Array.from(word).map((character, position) => {
                          const preceding = question.split(" ").slice(0, index).reduce((total, text) => total + text.length + 1, 0);
                          const bold = questionIndex < progress.question || (questionIndex === progress.question && preceding + position < progress.letter);
                          return (
                            <span key={position} className={styles.letter}>
                              <span className="invisible font-semibold">{character}</span>
                              <span className={styles.visible} style={{ fontWeight: bold ? 600 : 400 }}>{character}</span>
                            </span>
                          );
                        })}
                      </span>
                    </span>
                  ))}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
