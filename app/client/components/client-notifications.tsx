"use client";

import { useEffect, useState } from "react";
import { NotificationBellIcon } from "@/app/components/svg";

export default function ClientNotifications({
  initialUnread,
}: {
  initialUnread: number;
}) {
  const [unread, setUnread] = useState(initialUnread);
  useEffect(() => {
    let stopped = false;
    async function refresh() {
      if (document.visibilityState !== "visible") return;
      try {
        const response = await fetch("/api/client/notifications", {
          cache: "no-store",
        });
        if (!response.ok) return;
        const result = await response.json();
        if (!stopped) setUnread(result.unread);
      } catch {}
    }
    const update = () => {
      void refresh();
    };
    const timer = window.setInterval(update, 5000);
    window.addEventListener("client-chat-read", update);
    document.addEventListener("visibilitychange", update);
    update();
    return () => {
      stopped = true;
      clearInterval(timer);
      window.removeEventListener("client-chat-read", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  return (
    <button
      type="button"
      onClick={(event) => {
        const menu = event.currentTarget.closest("details");
        if (menu) menu.open = false;
        document
          .getElementById("private-chat-title")
          ?.scrollIntoView({
            block: "start",
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
              .matches
              ? "auto"
              : "smooth",
          });
      }}
      className="flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-2 py-3 text-left text-sm text-brand-600 hover:bg-brand-50"
    >
      <NotificationBellIcon className="size-5 shrink-0" />
      Уведомления
      {unread > 0 && (
        <span
          aria-label={`Новых сообщений: ${unread}`}
          aria-live="polite"
          className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1.5 text-xs font-semibold text-white"
        >
          {unread}
        </span>
      )}
    </button>
  );
}
