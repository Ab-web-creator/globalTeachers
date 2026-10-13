"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminVisitorExclusion() {
  const router = useRouter();
  useEffect(() => {
    // Remember this browser after logout, without exposing the signed cookie to JS.
    try { localStorage.setItem("tn-admin-analytics-excluded", "1"); } catch { /* Server cookie remains authoritative. */ }
    let sessionId: string | undefined;
    try {
      const session = JSON.parse(sessionStorage.getItem("tn-visit") ?? "null");
      if (typeof session?.id === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(session.id)) sessionId = session.id;
    } catch { /* Storage may be disabled. */ }
    void fetch("/admin/analytics/exclude", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sessionId ? { sessionId } : {}), credentials: "same-origin",
    }).then((response) => {
      if (response.ok) {
        try { sessionStorage.removeItem("tn-visit"); } catch { /* Storage may be disabled. */ }
        if (sessionId) router.refresh();
      }
    }).catch(() => { /* The browser marker already prevents new tracking. */ });
  }, [router]);
  return null;
}
