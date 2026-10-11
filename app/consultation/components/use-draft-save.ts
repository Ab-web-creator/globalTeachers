"use client";

import { useEffect, useRef } from "react";
import type { Answers } from "./form-fields";
import { consultationSteps } from "./consultation-steps";

type Identity = { id: string; token: string };

export default function useDraftSave(answers: Answers, step: number, paused: boolean) {
  const identity = useRef<Identity | null>(null);
  const revision = useRef(0);
  const queue = useRef<Promise<void>>(Promise.resolve());
  const trackedAnswers = useRef("");
  const pending = useRef(new Set<Promise<void>>());
  const lastSaved = useRef("");
  const latest = useRef({ answers, step, paused });
  const furthestStep = useRef(step);
  useEffect(() => {
    furthestStep.current = Math.max(furthestStep.current, step);
    latest.current = { answers, step, paused };
  }, [answers, step, paused]);

  function save() {
    const current = latest.current;
    if (current.paused || !current.answers.email.trim()) return;
    const snapshot = JSON.stringify({ answers: { ...current.answers, english: furthestStep.current < consultationSteps.findIndex((step) => step.fields[0] === "english") ? "" : current.answers.english }, step: consultationSteps[current.step].fields[0] });
    if (snapshot === lastSaved.current) return;
    if (!identity.current) identity.current = { id: crypto.randomUUID(), token: crypto.randomUUID() };
    const body = JSON.stringify({ ...JSON.parse(snapshot), draft: identity.current, revision: ++revision.current });
    lastSaved.current = snapshot;
    const request = queue.current.then(() => fetch("/api/consultation/draft", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true, signal: AbortSignal.timeout(5000) }))
      .then((response) => { if (!response.ok && lastSaved.current === snapshot) lastSaved.current = ""; })
      .catch(() => { if (lastSaved.current === snapshot) lastSaved.current = ""; })
      .finally(() => { pending.current.delete(request); });
    queue.current = request;
    pending.current.add(request);
  }

  useEffect(() => {
    const tracked = JSON.stringify([answers.qualification, answers.subject, answers.education, answers.english]);
    if (tracked !== trackedAnswers.current) {
      trackedAnswers.current = tracked;
      save();
    }
    const timer = setTimeout(save, 600);
    return () => clearTimeout(timer);
  }, [answers, step, paused]);

  useEffect(() => {
    const flush = () => save();
    const onHidden = () => { if (document.visibilityState === "hidden") save(); };
    const retry = setInterval(save, 10000);
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", onHidden);
    return () => {
      clearInterval(retry);
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onHidden);
    };
  }, []);

  return {
    waitForSave: () => Promise.all(pending.current),
    getIdentity: () => identity.current,
    startNew: () => { identity.current = null; revision.current = 0; lastSaved.current = ""; },
  };
}
