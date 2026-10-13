"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { publicAnalyticsPath } from "../../lib/analytics/validation";

const storageKey = "tn-visit";
const idleLifetime = 30 * 60 * 1000;

export default function VisitTracker() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);
  const memory = useRef<{ id: string; lastSeen: number } | null>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem("tn-admin-analytics-excluded") === "1") return;
    } catch { /* The API still checks the signed administrator exclusion cookie. */ }
    if (
      process.env.NODE_ENV !== "production" ||
      !publicAnalyticsPath(pathname)
    ) {
      lastPath.current = null;
      return;
    }
    if (
      navigator.doNotTrack === "1" ||
      (navigator as Navigator & { globalPrivacyControl?: boolean })
        .globalPrivacyControl
    )
      return;
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    const now = Date.now();
    let session = memory.current;
    try {
      const stored = JSON.parse(sessionStorage.getItem(storageKey) ?? "null");
      if (
        stored &&
        typeof stored.id === "string" &&
        typeof stored.lastSeen === "number"
      )
        session = stored;
    } catch {
      /* Storage may be disabled; keep a session in memory instead. */
    }
    if (!session || now - session.lastSeen >= idleLifetime)
      session = { id: crypto.randomUUID(), lastSeen: now };
    session.lastSeen = now;
    memory.current = session;
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(session));
    } catch {
      /* In-memory fallback. */
    }
    // Pathname only: confirmation tokens, query strings and form answers never leave the page.
    void fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: crypto.randomUUID(),
        sessionId: session.id,
        path: pathname,
      }),
      keepalive: true,
      credentials: "same-origin",
    }).catch(() => {
      /* Analytics must never interrupt the site. */
    });
  }, [pathname]);

  return null;
}
